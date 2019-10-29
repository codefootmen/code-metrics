const parseString = require("xml2js").parseString;
const fs = require("fs");
const cTable = require("console.table");
var xml = fs.readFileSync(__dirname + "/model.xmi", "utf8");

let model = {};
parseString(xml, function(err, result) {
  const classes =
    result["xmi:XMI"]["uml:Model"][0]["packagedElement"][0]["packagedElement"];
  classes.forEach(x => {
    let nOfChildren = 0;
    classes.forEach(y => {
      if ("generalization" in y) {
        if (x["$"]["xmi:id"] === y["generalization"][0]["$"]["general"]) {
          nOfChildren++;
        }
      }
    });
    
    let nOfParents =  "generalization" in x == true ? x["generalization"].length : 0;
    let noa = 0;
    if(nOfParents > 0){
      if(x["ownedAttribute"] != null){
        x["ownedAttribute"].forEach(y => {
          if(y["$"].isDerived === "false"){
            noa++;
          }
        });
      }
      if(x["ownedOperation"] != null){
        x["ownedOparation"].forEach(y => {
          if(y["$"].isDerived === "false"){
            noa++;
          }
        });
      }
    }

    model[x["$"].name] = {
      ownedAttributes:"ownedAttribute" in x == true ? x["ownedAttribute"].length : 0,
      ownedMembers: "ownedMember" in x == true ? x["ownedMember"].length : 0,
      ownedOperations:"ownedOperation" in x == true ? x["ownedOperation"].length : 0,
      parents: nOfParents,
      children: nOfChildren,
      addBySubclass: noa
    };
  });
});

output = [];

Object.keys(model).forEach(x => {
  output.push({
    Name: x,
    WMC: model[x].ownedOperations,
    DIT: model[x].parents,
    NOC: model[x].children,
    CBO: model[x].ownedMembers,
    CS: model[x].ownedAttributes + model[x].ownedOperations,
    NOO: 0,
    NOA: model[x].addBySubclass,
  });
});

console.table(output);
