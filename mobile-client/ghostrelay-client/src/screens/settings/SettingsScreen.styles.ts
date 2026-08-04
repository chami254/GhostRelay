import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

container:{

flex:1,

paddingHorizontal:22,

paddingTop:10,

},

statusTitle:{

fontSize:18,

fontWeight:"700",

color:Colors.primary,

marginBottom:15,

},

statusItem:{

fontSize:15,

color:Colors.text,

marginBottom:10,

},

version:{

marginTop:30,

textAlign:"center",

color:Colors.textSecondary,

fontSize:13,

}

});