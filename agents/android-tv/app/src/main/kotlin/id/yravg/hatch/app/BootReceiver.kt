package id.yravg.hatch.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Cold-boot recovery: no manual relaunch. Booting the core records the new boot id and locks (REBOOT_RECOVERY). */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        HatchRuntime.get(context)
        context.startActivity(Intent(context, HarnessActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }
}
