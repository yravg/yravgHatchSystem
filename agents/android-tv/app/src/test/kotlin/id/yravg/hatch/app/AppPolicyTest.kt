package id.yravg.hatch.app

import id.yravg.hatch.core.PermissionState
import id.yravg.hatch.core.ProvisioningProfile
import java.io.File
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class AppPolicyTest {
    private val manifest = File("src/main/AndroidManifest.xml").readText()

    @Test fun `manifest requests no hidden or privileged capability`() {
        val forbidden = listOf(
            "WRITE_SECURE_SETTINGS", "INSTALL_PACKAGES", "DELETE_PACKAGES", "MANAGE_DEVICE_POLICY", "MANAGE_EXTERNAL_STORAGE",
            "CHANGE_CONFIGURATION", "REBOOT", "SET_ALWAYS_FINISH", "DUMP", "INJECT_EVENTS", "READ_LOGS", "MASTER_CLEAR", "ACCESS_SUPERUSER", "BIND_ACCESSIBILITY_SERVICE",
        )
        for (p in forbidden) assertFalse(manifest.contains(p), p)
        assertFalse(manifest.contains("android:debuggable=\"true\""))
        assertFalse(manifest.contains("usesCleartextTraffic=\"true\""))
    }

    @Test fun `manifest holds exactly the two normal permissions and the leanback launcher`() {
        val perms = Regex("uses-permission android:name=\"([^\"]+)\"").findAll(manifest).map { it.groupValues[1] }.toList().sorted()
        assertEquals(listOf("android.permission.RECEIVE_BOOT_COMPLETED", "android.permission.SYSTEM_ALERT_WINDOW"), perms)
        assertTrue(manifest.contains("android.intent.category.LEANBACK_LAUNCHER"))
    }

    @Test fun `only a device owner app is PROVISIONED_UNPAIRED, everything else is UNPROVISIONED_APP`() {
        assertEquals(ProvisioningProfile.PROVISIONED_UNPAIRED, Adapters.profileFor(isDeviceOwner = true))
        assertEquals(ProvisioningProfile.UNPROVISIONED_APP, Adapters.profileFor(isDeviceOwner = false))
    }

    @Test fun `overlay state is GRANTED, MISSING when never granted, REVOKED when it was granted before`() {
        assertEquals(PermissionState.GRANTED, Adapters.permissionStateFor(canDrawOverlays = true, everGranted = false))
        assertEquals(PermissionState.MISSING, Adapters.permissionStateFor(canDrawOverlays = false, everGranted = false))
        assertEquals(PermissionState.REVOKED, Adapters.permissionStateFor(canDrawOverlays = false, everGranted = true))
    }
}
