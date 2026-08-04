import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

container:{

flex:1,

padding:22,

},

identityCard:{

backgroundColor:Colors.card,

padding:18,

borderRadius:16,

marginBottom:18,

borderWidth:1,

borderColor:Colors.border,

},

from:{

color:Colors.textSecondary,

},

sender:{

fontSize:22,

fontWeight:"700",

color:Colors.text,

marginTop:5,

},

verified:{

marginTop:10,

color:Colors.primary,

},

warningCard:{

backgroundColor:"#332A15",

padding:18,

borderRadius:16,

marginBottom:18,

},

warning:{

color:"#FFD166",

lineHeight:22,

},

messageCard:{

flex:1,

backgroundColor:Colors.card,

padding:20,

borderRadius:16,

borderWidth:1,

borderColor:Colors.border,

marginBottom:18,

},

message:{

color:Colors.text,

fontSize:16,

lineHeight:28,

},

timerCard:{

alignItems:"center",

marginBottom:25,

},

timerLabel:{

color:Colors.textSecondary,

},

timer:{

fontSize:34,

fontWeight:"700",

color:Colors.primary,

}

});