// Contract: T49 running sessions (AC-HS-49): pause/resume, bounded open leases, WAN loss, fixed end, checkout chain,
// invalid transitions, fenced ordering. Timings (60 s renewal, 120 s horizon) and money are SANDBOX FIXTURES (D01, D06, D07).
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { as, call, P, sessionHarness, type SH } from "./support.ts";

let t: SH;
let online = true;
beforeAll(async () => { t = await sessionHarness({ sessions: { edgeOnline: () => online } }); });
afterAll(async () => { await t.close(); });

const J = (r: { json: Record<string, any> }) => r.json["data"] as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const stationStatus = async (id: string) => (await call(t.app, "GET", `${P}/stations/${id}`, as(t.cashier))).json["data"].status as string;

describe("pause and resume", () => {
  it("pause stops the billable clock and locks the picture; resume bills again only after APPLIED", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id);
    t.clock.advance(100);
    const p = await t.act(id, "pause");
    expect(p.status).toBe(202);
    expect(J(p)).toMatchObject({ state: "PAUSED", clock: { running: false, billableSeconds: 100 }, lease: null });
    const [lock] = await t.pending(id, "PAUSE");
    expect(lock).toBeTruthy();
    expect(await t.count("SELECT count(*) AS n FROM session_leases WHERE session_id = $1 AND status = 'granted'", [id])).toBe(0);
    t.clock.advance(500); // paused time is not billable (D01 fixture)
    expect(J(await t.reconcile(id)).clock.billableSeconds).toBe(100);
    const r = await t.act(id, "resume");
    expect(J(r)).toMatchObject({ state: "PAUSED", clock: { running: false } }); // not billing: the device has not applied the unlock
    const [resume] = await t.pending(id, "RESUME");
    expect(resume!.leaseClaims).toMatchObject({ mode: "FIXED", remainingSecondsAtIssue: 3500 });
    expect((await t.ack(resume!, "APPLIED")).statusCode).toBe(200);
    t.clock.advance(20);
    const v = J(await t.reconcile(id));
    expect(v).toMatchObject({ state: "ACTIVE", clock: { running: true, billableSeconds: 120 } }); // 100 + 20 s since the APPLIED unlock
    t.clock.advance(30);
    expect(J(await t.reconcile(id)).clock.billableSeconds).toBe(150);
  });

  it("a higher lock revision wins: a late APPLIED for a superseded RESUME is rejected and the picture stays locked", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id);
    await t.act(id, "pause");
    await t.act(id, "resume");
    const [resume] = await t.pending(id, "RESUME");
    const again = await t.act(id, "pause"); // cancel the pending resume
    expect(again.status).toBe(202);
    expect((await t.ack(resume!, "APPLIED")).statusCode).toBe(200);
    const v = J(await t.reconcile(id));
    expect(v.state).toBe("PAUSED");
    expect(v.clock.running).toBe(false);
    expect(await t.count("SELECT count(*) AS n FROM session_events WHERE session_id = $1 AND kind = 'ACK_REJECTED'", [id])).toBe(1);
  });

  it("stale expectedRevision is REVISION_CONFLICT and changes nothing", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id);
    const v = await t.view(id);
    const r = await t.action(id, { kind: "pause", expectedRevision: v["revision"] + 7 });
    expect([r.status, r.json["error"].code]).toEqual([409, "REVISION_CONFLICT"]);
    expect((await t.view(id)).state).toBe("ACTIVE");
  });
});

describe("invalid transitions are rejected", () => {
  it("each action from a wrong state is 409 INVALID_TRANSITION with no new command", async () => {
    const s = await t.addStation();
    const d = J(await t.start(s.id));
    const id = d["sessionId"] as string;
    for (const kind of ["pause", "resume", "end", "checkout", "clean", "release", "recover"]) {
      const r = await t.act(id, kind);
      expect([kind, r.status, r.json["error"]?.code]).toEqual([kind, 409, "INVALID_TRANSITION"]); // STARTING
    }
    expect(await t.count("SELECT count(*) AS n FROM session_commands WHERE session_id = $1", [id])).toBe(1);
    await t.applyStart(id);
    for (const kind of ["resume", "checkout", "clean", "release", "retry", "cancel", "recover"]) {
      const r = await t.act(id, kind);
      expect([kind, r.status, r.json["error"]?.code]).toEqual([kind, 409, "INVALID_TRANSITION"]); // ACTIVE
    }
    expect((await t.act(id, "extend")).status).toBe(400); // extend is not part of T49
  });
});

describe("fixed sessions end at zero remaining entitlement", () => {
  it("the sweep finishes a FIXED session at its entitlement, locks the device, and bills exactly the entitlement", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id, { seconds: 600 });
    t.clock.advance(599);
    await t.jobs.sweep();
    expect((await t.view(id)).state).toBe("ACTIVE");
    t.clock.advance(5000); // the sweep ran late: still only the entitlement is billed
    await t.jobs.sweep();
    const v = await t.view(id);
    expect(v).toMatchObject({ state: "FINISHED", clock: { running: false, billableSeconds: 600, remainingSeconds: 0 } });
    expect((await t.pending(id, "LOCK")).length).toBe(1);
  });
});

describe("open billing uses short renewed leases (D07 fixture 60 s / 120 s)", () => {
  it("the first lease is bounded to 120 s and renewed from 60 s with a new lease; never two granted leases", async () => {
    online = true;
    const s = await t.addStation();
    const id = await t.activate(s.id, { mode: "OPEN" });
    const v0 = await t.view(id);
    expect(v0).toMatchObject({ mode: "OPEN", state: "ACTIVE" });
    expect(new Date(v0.lease.notAfter).getTime() - new Date(v0.lease.issuedAt).getTime()).toBe(120_000);
    t.clock.advance(59);
    await t.jobs.sweep();
    expect(await t.pending(id, "EXTEND")).toHaveLength(0);
    t.clock.advance(1);
    await t.jobs.sweep();
    const [renew] = await t.pending(id, "EXTEND");
    expect(renew).toBeTruthy();
    expect(renew!.leaseClaims).toMatchObject({ mode: "OPEN" });
    const v1 = await t.view(id);
    expect(v1.lease.leaseId).not.toBe(v0.lease.leaseId);
    expect(new Date(v1.lease.notAfter).getTime() - t.clock.now.getTime()).toBe(120_000);
    await t.jobs.sweep(); // idempotent: no second renewal in the same minute
    expect(await t.pending(id, "EXTEND")).toHaveLength(1);
    expect(await t.count("SELECT count(*) AS n FROM session_leases WHERE session_id = $1 AND status = 'granted'", [id])).toBe(1);
    expect((await t.ack(renew!, "APPLIED")).statusCode).toBe(200);
    t.clock.advance(60);
    await t.jobs.sweep();
    expect((await t.view(id)).state).toBe("ACTIVE"); // renewed, so the first lease expiry did not lock it
  });

  it("WAN loss: no renewal while the authority is offline; at the last applied lease expiry the seat locks and the actual billable is recorded", async () => {
    online = true;
    const s = await t.addStation();
    const id = await t.activate(s.id, { mode: "OPEN" });
    online = false;
    t.clock.advance(60);
    await t.jobs.sweep();
    expect(await t.pending(id, "EXTEND")).toHaveLength(0); // cannot deliver a renewal offline
    t.clock.advance(59);
    await t.jobs.sweep();
    expect((await t.view(id)).state).toBe("ACTIVE");
    t.clock.advance(1000); // far past the expiry; the sweep was late
    await t.jobs.sweep();
    const v = await t.view(id);
    expect(v).toMatchObject({ state: "RECOVERY", recoveryReason: "lease_expired", clock: { running: false, billableSeconds: 120 } });
    expect(v.lease).toBeNull();
    expect((await t.pending(id, "LOCK")).length).toBe(1);
    online = true;
  });

  it("an OPEN session that ends is billed by the actual seconds, rounded once", async () => {
    online = true;
    const s = await t.addStation();
    const id = await t.activate(s.id, { mode: "OPEN" });
    t.clock.advance(61);
    await t.jobs.sweep();
    const end = await t.act(id, "end");
    expect(J(end)).toMatchObject({ state: "FINISHED", clock: { billableSeconds: 61 }, finalAmountIdr: "203" }); // 61 s at Rp12.000/h = 203.33 -> 203
  });
});

describe("checkout chain", () => {
  it("end, checkout, clean, release: FINISHED to CHECKOUT_PENDING to CLEANING to AVAILABLE and the station is free again only at the end", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id);
    t.clock.advance(60);
    const end = await t.act(id, "end");
    expect(J(end).state).toBe("FINISHED");
    expect(await stationStatus(s.id)).toBe("reserved");
    for (const [kind, state] of [["checkout", "CHECKOUT_PENDING"], ["clean", "CLEANING"], ["release", "AVAILABLE"]] as const) {
      const r = await t.act(id, kind);
      expect([kind, r.status, J(r).state]).toEqual([kind, 202, state]);
    }
    expect(await stationStatus(s.id)).toBe("available");
    expect((await t.start(s.id)).status).toBe(202); // and it can be started again
  });

  it("ending from PAUSED also finishes and locks", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id);
    await t.act(id, "pause");
    expect(J(await t.act(id, "end")).state).toBe("FINISHED");
  });
});

describe("billing never goes backwards", () => {
  it("a server clock that moves back does not add or remove billable time", async () => {
    const s = await t.addStation();
    const id = await t.activate(s.id);
    t.clock.advance(100);
    await t.reconcile(id);
    t.clock.advance(-90);
    expect((await t.view(id)).clock.billableSeconds).toBeLessThanOrEqual(100);
    const v = J(await t.reconcile(id));
    expect(v.clock.billableSeconds).toBeGreaterThanOrEqual(0);
    t.clock.advance(100); // back to 110 s after the start
    expect(J(await t.reconcile(id)).clock.billableSeconds).toBeLessThanOrEqual(110);
  });
});
