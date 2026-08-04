import { StyleSheet } from "react-native";
import { Colors } from "../../theme";

export default StyleSheet.create({

  container:{

    flex:1,

    paddingHorizontal:20,

    paddingTop:10,

  },

  header:{

    flexDirection:"row",

    justifyContent:"space-between",

    alignItems:"center",

    marginBottom:18,

  },

  title:{

    color:Colors.text,

    fontSize:28,

    fontWeight:"700",

  },

  section:{

    color:Colors.textSecondary,

    marginTop:10,

    marginBottom:10,

    fontWeight:"700",

    letterSpacing:1,

  },

});