package id.yravg.hatch.app

import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.os.Bundle
import android.view.KeyEvent
import android.widget.TextView
import id.yravg.hatch.core.KeyDisposition
import id.yravg.hatch.core.TvKey

/** Functional neutral test harness only. No product UI: it prints the core decision as plain text. */
class HarnessActivity : Activity() {
    private lateinit var view: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        view = TextView(this).apply { textSize = 22f; setPadding(48, 48, 48, 48) }
        setContentView(view)
        // Lock task mode is a public API available only to a device-owner app (venue-owned managed provisioning).
        if (HatchRuntime.isDeviceOwner(this)) {
            val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
            dpm.setLockTaskPackages(ComponentName(this, DeviceAdmin::class.java), arrayOf(packageName))
            runCatching { startLockTask() }
        }
    }

    override fun onResume() { super.onResume(); render() }

    private fun render() {
        val core = HatchRuntime.get(this)
        val d = core.decide()
        view.text = buildString {
            appendLine("Hatch TV harness (test only)")
            appendLine("state: ${core.tvState()}  claim: ${d.securityClaim}  readiness: ${d.readiness}")
            appendLine("locked: ${d.locked}  reason: ${d.reason}  remaining: ${d.remainingSeconds}s  route: ${d.route}")
            appendLine("cec setup: ${core.cecSetupStatus()}  cec power: ${core.capabilities().cecPower}")
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        val key = when (keyCode) {
            KeyEvent.KEYCODE_HOME -> TvKey.HOME
            KeyEvent.KEYCODE_BACK -> TvKey.BACK
            KeyEvent.KEYCODE_TV_INPUT -> TvKey.INPUT
            else -> TvKey.OTHER
        }
        return if (HatchRuntime.get(this).handleKey(key) == KeyDisposition.CONSUMED_LOCKED) true else super.onKeyDown(keyCode, event)
    }
}
