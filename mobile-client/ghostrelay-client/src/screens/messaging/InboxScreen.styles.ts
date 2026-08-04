import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

container:{

flex:1,

paddingHorizontal:22,

paddingTop:10,

},

heading:{

fontSize:24,

fontWeight:"700",

color:Colors.text,

marginBottom:20,

},

messageCard:{

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center",

padding:18,

marginBottom:14,

backgroundColor:Colors.card,

borderRadius:16,

borderWidth:1,

borderColor:Colors.border,

},

leftSection:{

flexDirection:"row",

alignItems:"center",

},

textContainer:{

marginLeft:16,

},

sender:{

fontSize:17,

fontWeight:"700",

color:Colors.text,

},

subtitle:{

marginTop:4,

color:Colors.primary,

},

time:{

marginTop:4,

fontSize:12,

color:Colors.textSecondary,

},

footer:{

marginTop:20,

textAlign:"center",

color:Colors.textSecondary,

lineHeight:22,

}

});