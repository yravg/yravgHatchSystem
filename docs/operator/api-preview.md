# Backend API preview (live, Tailscale only)

This is the real backend running on the VPS with **fixture data** (a fake venue, sandbox prices). There is no screen yet, so you check it with `curl`. Payments are off: no Midtrans settings are set.

You must be on the Tailscale network. The base URL is `http://100.108.253.30:33103`. Set it once:

```bash
B=http://100.108.253.30:33103
```

Logins are in `/home/user/dev/HatchSystem/preview-credentials.txt` on the VPS (readable only by you). Use the **cashier** login. The owner login needs two-factor enrolment before it can do anything.

```bash
EMAIL=cashier@demo-fixture.invalid
PW='<cashier password from the file>'
```

## 1. Health

```bash
curl -s $B/api/v1/health
```
Expect `"status":"ok"`.

## 2. Log in

The session cookie is marked `Secure`, so curl will not send it back over plain http by itself. Copy it by hand:

```bash
curl -s -D /tmp/h.txt -o /tmp/login.json -H 'content-type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PW\"}" $B/api/v1/auth/session
CK=$(grep -i '^set-cookie' /tmp/h.txt | sed -E 's/^[^:]*: ([^;]*);.*/\1/' | tr -d '\r')
CSRF=$(sed -E 's/.*"csrfToken":"([^"]*)".*/\1/' /tmp/login.json)
```
Expect HTTP 200 and `"roles":["cashier"]`. A wrong password gives 401.

## 3. List stations

```bash
curl -s -H "cookie: $CK" $B/api/v1/stations
```
Expect two stations, `Station 1 (fixture)` and `Station 2 (fixture)`. Copy one `stationId`:

```bash
SID=<stationId>
```

## 4. Ask for a price quote

The rate is the fixture Rp12.000 per hour. 5400 seconds (1.5 hours) should be Rp18.000:

```bash
curl -s -H "cookie: $CK" -H "x-hatch-csrf: $CSRF" -H "idempotency-key: $(cat /proc/sys/kernel/random/uuid)" \
  -H 'content-type: application/json' \
  -d "{\"stationId\":\"$SID\",\"segments\":[{\"seconds\":5400,\"paused\":false}]}" $B/api/v1/quotes
```
Expect `"amountIdr":"18000"`.

## 5. Try another venue's station (must be 404)

A second fixture venue exists. Its station id is fixed. You are logged in to the demo venue, so the server must answer as if it does not exist:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -H "cookie: $CK" $B/api/v1/stations/00000000-0000-4000-8000-0000000000b1
```
Expect `404`.

## Notes

- The service is `hatchsystem-api`. If a call fails, ask for its log with `vps-preview logs hatchsystem-api`.
- Everything here is fixture data. Prices are sandbox values, not an approved price list.
