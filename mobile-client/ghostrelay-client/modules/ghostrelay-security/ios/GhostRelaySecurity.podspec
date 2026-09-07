Pod::Spec.new do |s|

  s.name         = 'GhostRelaySecurity'
  s.version      = '0.1.0'

  s.summary      = 'Native biometric security module for GhostRelay'
  s.description  = 'Provides native biometric authentication and availability checks for the GhostRelay secure messaging application.'

  s.author       = 'GhostRelay Development Team'
  s.homepage     = 'https://github.com/'

  s.platforms    = {
    :ios => '16.4'
  }

  s.source       = { git: '' }

  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.framework = 'LocalAuthentication'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"

end