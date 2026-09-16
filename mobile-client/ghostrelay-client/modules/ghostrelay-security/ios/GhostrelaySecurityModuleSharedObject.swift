import ExpoModulesCore

public class GhostrelaySecurityModuleSharedObject: SharedObject {
  var count: Int = 0

  override public func sharedObjectDidRelease() {
    super.sharedObjectDidRelease()
  }
}
