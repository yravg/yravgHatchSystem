package id.yravg.hatch.core

// Contract: device-side view of the 8-digit / 5-minute pairing challenge (D32). Refresh revokes the old code.
// The tracker is bookkeeping only: it can never unlock the picture. Only a verified lease can.
enum class PairingState { NONE, WAITING, EXPIRED }

class PairingTracker(private val clock: DeviceClock) {
    private var code: String? = null
    private var expiresMono = 0L

    fun begin(newCode: String) { code = newCode; expiresMono = clock.monotonicMs() + TTL_MS }
    fun refresh(newCode: String) = begin(newCode)
    fun state(): PairingState = when {
        code == null -> PairingState.NONE
        clock.monotonicMs() >= expiresMono -> PairingState.EXPIRED
        else -> PairingState.WAITING
    }
    fun codeValid(candidate: String): Boolean = state() == PairingState.WAITING && candidate == code

    companion object { const val TTL_MS = 300_000L }
}
