import SwiftUI
import ExpoModulesCore
import ExpoUI

final class GhostrelaySecuritySwiftUIViewProps: UIBaseViewProps {
  @Field var title: String = ""
}

struct GhostrelaySecuritySwiftUIView: ExpoSwiftUI.View {
  @ObservedObject public var props: GhostrelaySecuritySwiftUIViewProps

  var body: some View {
    VStack {
      Text(props.title)
        .font(.headline)
      Children()
    }
  }
}
