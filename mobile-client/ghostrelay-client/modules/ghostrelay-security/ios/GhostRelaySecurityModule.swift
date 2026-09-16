import ExpoModulesCore
import ExpoUI

public class GhostrelaySecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GhostrelaySecurity")

    Events("onChange")

    Constant("PI") {
      Double.pi
    }

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    View(GhostrelaySecurityView.self) {
      Events("onTap")
    }

    Class(GhostrelaySecurityModuleSharedObject.self) {
      Constructor { () -> GhostrelaySecurityModuleSharedObject in
        return GhostrelaySecurityModuleSharedObject()
      }

      Property("count") { (ref: GhostrelaySecurityModuleSharedObject) -> Int in
        return ref.count
      }
      .set { (ref: GhostrelaySecurityModuleSharedObject, count: Int) in
        ref.count = count
      }
    }

    ExpoUIView(GhostrelaySecuritySwiftUIView.self)

    OnCreate {
      ViewModifierRegistry.register("ghostrelaySecuritySwiftUIModifier") { params, appContext, _ in
        return try GhostrelaySecuritySwiftUIModifier(from: params, appContext: appContext)
      }
    }

    OnDestroy {
      ViewModifierRegistry.unregister("ghostrelaySecuritySwiftUIModifier")
    }
  }
}
