package id.yravg.hatch.app

import id.yravg.hatch.core.PermissionState
import id.yravg.hatch.core.ProvisioningProfile
import id.yravg.hatch.core.SignatureVerifier
import org.bouncycastle.crypto.params.Ed25519PublicKeyParameters
import org.bouncycastle.crypto.signers.Ed25519Signer
import java.util.Base64

// Contract: pure mapping from Android facts to core inputs. Public SDK only: DevicePolicyManager.isDeviceOwnerApp and
// Settings.canDrawOverlays. Nothing here grants a permission or elevates privilege.
object Adapters {
    /** Only a venue-owned managed provisioning (this app is device owner) earns the PROVISIONED_UNPAIRED claim (D27). */
    fun profileFor(isDeviceOwner: Boolean) =
        if (isDeviceOwner) ProvisioningProfile.PROVISIONED_UNPAIRED else ProvisioningProfile.UNPROVISIONED_APP

    /** REVOKED when the overlay was granted before and is gone now (user/OS revoke), MISSING when never granted. */
    fun permissionStateFor(canDrawOverlays: Boolean, everGranted: Boolean) = when {
        canDrawOverlays -> PermissionState.GRANTED
        everGranted -> PermissionState.REVOKED
        else -> PermissionState.MISSING
    }
}

/** Ed25519 via BouncyCastle's lightweight API: works on Android 8+ where the platform has no Ed25519 provider. */
object BcEd25519Verifier : SignatureVerifier {
    override fun verify(rawPublicKeyB64u: String, message: ByteArray, sigB64u: String): Boolean = try {
        val raw = Base64.getUrlDecoder().decode(rawPublicKeyB64u)
        require(raw.size == 32)
        val sig = Base64.getUrlDecoder().decode(sigB64u)
        Ed25519Signer().run { init(false, Ed25519PublicKeyParameters(raw, 0)); update(message, 0, message.size); verifySignature(sig) }
    } catch (_: Exception) { false }
}
