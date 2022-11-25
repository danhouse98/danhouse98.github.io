/*
id - holds item id
int, str, agi, mastery, verse, crit, haste- shows 0 if stat is not present, 1 if stat is present on item
slot - holds slot the item is equiped to
type - holds tag for item
    armor - armor type (ie plate, cloth, leather)
    trinket - type of trinket
    weapon - type of weapon w/ stat modifier if applicable
*/
//var [] Items;

function Item() {
    this.id = 0;
    this.int = 0;
    this.str = 0;
    this.agi = 0;
    this.mastery = 0;
    this.verse = 0;
    this.crit = 0;
    this.haste = 0;
    this.slot = "";
    this.type = "";
}

const itemArray = [];
const filteredItemArray = [];
const indexMap = new Map();

var dungeonCounter = 0;


var slots = ['head', 'shoulder', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'neck', 'back', 'ring', 'weapon', 'off-hand', 'trinket'];

var mythic0 = ["Ruby Life Pools", "Brackenhide Hollow", "The Nokhud Offensive", "Uldaman: Legacy of Tyr", "Algeth'ar Academy", "The Azure Vault", "Halls of Illusion", "Neltharus"];
var season1MythicPlus = ["Ruby Life Pools", "The Nokhud OFfensive", "The Azure Vault", "Algeth'ar Academy", "Halls of Valor", "Court of Stars", "Shadowmoon Burial Grounds", "Temple of the Jade Serpent"];
var raids = ["Vault of The Incarnates"]

//Reads JSON file and fills DOM with content
$(document).ready(function () {

    $.ajax({
        type: "get",
        url: "json/items.json",
        beforeSend: function () {
            //TODO rename id tag
            //$("#comparisontext").html("Loading...");
        },
        timeout: 10000,
        error: function (xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success: function (data) {
            //TODO rename id tag
            $("#dungeonList").html("");
            //TODO rename id tag
            //dungeon List
            $.each(data, function () {
                var dungeonID = "";
                var bossID = "";
                var bossSlotID = "";
                //dungeonList
                $.each(this, function (key, dungeonList) {
                    var bossCounter = 0;
                    dungeonID = "dungeon" + dungeonCounter.toString();
                    var bossTableHTML = "<div class= 'dungeon' id= '" + dungeonID + "'><h2>" + dungeonList.dungeon_name + "</h2>";
                    $('#dungeonList').append(bossTableHTML);

                    indexMap.set(dungeonList.dungeon_name, dungeonID);

                    //boss list
                    $.each(dungeonList.bosses, function (key2, bossList) {
                        bossID = bossCounter.toString();

                        bossTableHTML = "<div class='boss'><div class='imgbox'><img src='https://wow.zamimg.com/images/wow/journal/" + bossList.imglink + "' alt='" + bossList.name + "'><h3>" + bossList.name + "</h3></div><table>" +
                            "<tr><th class ='head'>Head</th><th class='shoulder'>Shoulder</th><th class='chest'>Chest</th><th class='wrist'>Wrist</th><th class='hands'>Hands</th>" +
                            "<th class='waist'>Waist</th><th class='legs'>Legs</th><th class='feet'>Feet</th><th class='neck'>Neck</th><th class='back'>Back</th>" +
                            "<th class='ring'>Rings</th><th class='weapon'>Weapon</th><th class='off-hand'>Off-Hand</th><th class='trinket'>Trinket</th></tr><tr>";

                        for (var k = 0; k < slots.length; k++) {
                            bossSlotID = dungeonID + "." + bossID + "." + slots[k];
                            bossTableHTML += "<td id='" + bossSlotID + "' class='" + slots[k] + "'></td>";
                        }

                        bossTableHTML += "</tr></table></div><br>";
                        $("#dungeonList").append(dungeonID);

                        //item List
                        $.each(bossList.drops, function (key3, itemList) {
                            bossSlotID = dungeonID + "." + bossID + "." + itemList.slot;

                            var elem = document.getElementById(bossSlotID);

                            var itemInfo = '<a id="' + itemList.id + '" href="https://www.wowhead.com/item=' + itemList.id +
                                ' data-wh-icon-added="true" class="q3" data-wh-rename-link="false">' +
                                '<span class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="item">' +
                                '<ins style="background-image: url(&quot;https://wow.zamimg.com/images/wow/icons/medium/' + itemList.imglink + '&quot");"></ins><del></del></span></a>';

                            if (elem != null) {
                                elem.insertAdjacentHTML('beforeend', itemInfo);
                            } else {
                                console.log("Invalid entry - ID : " + itemList.id);
                            }

                            //Filling out itemArray with item info
                            var currentItem = new Item();
                            currentItem.id = itemList.id;
                            currentItem.type = itemList.type;

                            for (var i = 0; i < itemList.stats.length; i++) {
                                switch (itemList.stats[i]) {
                                    case "mastery":
                                        currentItem.mastery = 1;
                                        break;
                                    case "verse":
                                        currentItem.verse = 1;
                                        break;
                                    case "crit":
                                        currentItem.crit = 1;
                                        break;
                                    case "haste":
                                        currentItem.haste = 1;
                                        break;
                                }
                            }

                            itemArray.push(currentItem);
                        });

                        bossCounter++;
                    });


                    bossTableHTML = "</div>";
                    $("#dungeonList").append(bossTableHTML);
                    dungeonCounter++;
                });
            });
        }
    });
});

/*
//dungeon list
for (var i = 0; i < data.dungeon.length; i++) {
    //sets dungeon id respective to amount of dungeons
    dungeonID = i.toString();

    //boss list
    for (var j = 0; j < data.dungeon[i].bosses.length; j++) {
        //sets dungeon id respective to amount of bosses
        bossID = j.toString();
        var bossTableHTML = "<div class= 'dungeon' id= 'dungeon" + i.toString() + "'><div class='boss'><table><tr><th>Head</th><th>Shoulder</th><th>Chest</th><th>Wrist</th><th>Hands</th><th>Waist</th><th>Legs</th><th>Feet</th><th>Neck</th><th>Back</th><th>Rings</th><th>Weapon</th><th>Trinket</th></tr><tr>";

        for (var k = 0; k < slots.length; k++) {
            bossSlotID = dungeonID + "." + bossID + "." + slots[k];
            bossTableHTML += "<tr id='" + bossSlotID + "'></tr>";
        }

        bossTableHTML += "</tr></table></div></div>";
        $('#dungeonList').append(bossTableHTML);

        //item list
        for (var k = 0; k < data.dungeon[i].bosses[j].drops.length; k++) {

            bossSlotID = "#" + dungeonID + "." + bossID + "." + data.dungeon[i].bosses[j].drops[k].slot;
            //build wowhead links
            //TODO implement dynamic id values to append to the correct td element
            $(bossSlotID).append(
                '<a id="' + data.dungeon[i].bosses[j].drops[k].id + '" href="https://www.wowhead.com/item=' + data.dungeon[i].bosses[j].drops[k].id +
                ' data-wh-icon-added="true" class="q3" data-wh-rename-link="false">' +
                '<span class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="item">' +
                '<ins style="background-image: url(&quot;' + data.dungeon[i].bosses[j].drops[k].imglink + '&quot;);"></ins><del></del></span></a>'
            );
        }
    }
}
});
});
},
//On completeion, show the entry with index 0
complete: function () {
}
}
});*/

//Holds class list with all relevant cooresponding subclasses
var classes = {
    "classList": [{ "class": "Shaman", "subclass": [{ "name": "Elemental" }, { "name": "Enhancement" }, { "name": "Restoration" }] },
    { "class": "Death Knight", "subclass": [{ "name": "Blood" }, { "name": "Frost" }, { "name": "Unholy" }] }, { "class": "Monk", "subclass": [{ "name": "Mistweaver" }, { "name": "Brewmaster" }, { "name": "Windwalker" }] },
    { "class": "Demon Hunter", "subclass": [{ "name": "Havoc" }, { "name": "Vengence" }] },
    { "class": "Warrior", "subclass": [{ "name": "Protection" }, { "name": "Arms" }, { "name": "Fury" }] },
    { "class": "Mage", "subclass": [{ "name": "Frost", "name": "Fire" }, { "name": "Arcane" }] },
    { "class": "Hunter", "subclass": [{ "name": "Survival" }, { "name": "Marksmanship" }, { "name": "Beast Mastery" }] },
    { "class": "Druid", "subclass": [{ "name": "Balance" }, { "name": "Feral" }, { "name": "Guardian" }, { "name": "Restoration" }] },
    { "class": "Rouge", "subclass": [{ "name": "Outlaw" }, { "name": "Assassination" }, { "name": "Subtlety" }] },
    { "class": "Priest", "subclass": [{ "name": "Discipline" }, { "name": "Holy" }, { "name": "Shadow" }] },
    { "class": "Paladin", "subclass": [{ "name": "Holy" }, { "name": "Protection" }, { "name": "Retribution" }] },
    { "class": "Warlock", "subclass": [{ "name": "Affliction" }, { "name": "Demonology" }, { "name": "Destruction" }] },
    { "class": "Evoker", "subclass": [{ "name": "Devastation" }, { "name": "Preservation" }] }]
};

var classCounter = 0;

//manages control panel
$(document).ready(function () {
    var classHTML = "";

    $.each(classes.classList, function (i, elementText) {
        classHTML += "<option value ='class" + classCounter + "'>" + elementText.class + "</option>";
        var subclassHTML = "<select name='" + elementText.class + "' id = 'class" + classCounter + "'>";
        $.each(elementText.subclass, function (j, subElementText) {
            subclassHTML += "<option value='" + subElementText.name + "'>" + subElementText.name + "</option>";
        });
        subclassHTML += "</select>"
        $("#subclassDropdown").append(subclassHTML);
        if (classCounter != 0) {
            var id = "class" + classCounter;
            var e = document.getElementById(id);
            e.style.display = "none"
        }
        classCounter++;


    });

    slotHTML = "<form><div>";
    //Slot Table
    for (var i = 0; i < slots.length; i++) {
        var slotName = slots[i];
        slotName = slotName.charAt(0).toUpperCase() + slotName.slice(1);
        slotHTML += "<input type='checkbox' id='slot" + i + "' value='" + slots[i] + "' name ='slot' class='slotCheckbox' checked>" +
            "<label for ='slot" + i + "'>" + slotName + "</label>";

        if (i == 6) {
            slotHTML += '</div><div>';
        }
    }
    slotHTML += "<br><button type='button' onclick='slotUpdate()' value='Filter Slots'>Filter Slots</button></form>";

    $('#slotPanel').append(slotHTML);
    $("#classDropdown").append(classHTML);
});

//manages dynamic dropdown box
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("classDropdown").addEventListener("change", function () {
        var e = document.getElementById("classDropdown");
        var value = e.value;



        for (var i = 0; i < classCounter; i++) {
            var id = "class" + i;
            //console.log(id);
            var element = document.getElementById(id);

            if (value === id) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    })
});

function slotUpdate() {
    var checkboxValue = "";
    var inputElements = document.getElementsByClassName('slotCheckbox');
    var changedElements;
    for (var i = 0; i < inputElements.length; i++) {
        checkboxValue = inputElements[i].value;

        //console.log(checkboxValue + " : " + inputElements[i].checked);

        changedElements = document.getElementsByClassName(checkboxValue);
        if (inputElements[i].checked) {
            for (var j = 0; j < changedElements.length; j++) {
                changedElements[j].style.display = "block";
            }
        } else {
            for (var j = 0; j < changedElements.length; j++) {
                changedElements[j].style.display = "none";
            }
        }
    }
}

//Reads statPanel and hides & shows items based on the input
function statUpdate() {
    var checkboxValue = "";
    var inputElements = document.getElementsByClassName('statCheckbox');
    var changedElements;
    var flag = '';

    //get appropriate flag 'or' or 'and'
    var ele = document.getElementsByClassName('andOr');
    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            flag = ele[i].value;
            break;
        }
    }

    console.log(flag);

    var statArray = [];

    //stat filter handler
    for (var i = 0; i < inputElements.length; i++) {
        checkboxValue = inputElements[i].value;
        console.log(checkboxValue + " : " + inputElements[i].checked);
        changedElements = document.getElementsByClassName(checkboxValue);

        //gets all wanted stats
        if (inputElements[i].checked) {
            statArray.push(inputElements[i].value);
        }
    }

    //Loop through itemArray, hide all items then show all relevent items
    for (var i = 0; i < itemArray.length; i++) {
        var id = itemArray[i].id;

        //TODO make sure id & vals are working properly
        console.log(id + " m: " + itemArray[i].mastery + " v: " + itemArray[i].verse + ' c: ' + itemArray[i].crit + ' h: ' + itemArray[i].haste);

        var element = document.getElementById(id);
        //hide each entry
        element.style.display = 'none';

        //only needs to check 1 at a time
        if (flag === "or") {

            var orChecker = "";
            for (var j = 0; j < statArray.length && orChecker !== 'passed'; j++) {
                //check if stat is stored properly
                console.log(statArray[j]);
                switch (statArray[j]) {
                    case 'mastery':
                        if (itemArray[i].mastery == 1) {
                            orChecker = 'passed';
                            element.style.display = 'block';
                        }
                        break;
                    case 'haste':
                        if (itemArray[i].haste == 1) {
                            orChecker = 'passed';
                            element.style.display = 'block';
                        }
                        break;
                    case 'verse':
                        if (itemArray[i].verse == 1) {
                            orChecker = 'passed';
                            element.style.display = 'block';
                        }
                        break;
                    case 'crit':
                        if (itemArray[i].crit == 1) {
                            orChecker = 'passed';
                            element.style.display = 'block';
                        }
                        break;
                }
            }

            //else check all stats before changing
        } else {

            var andChecker = "";
            for (var j = 0; j < statArray.length && andChecker !== 'failed'; j++) {
                switch (statArray[j]) {
                    case 'mastery':
                        if (itemArray[i].mastery != 1) {
                            andChecker = 'failed';
                        }
                        break;
                    case 'haste':
                        if (itemArray[i].haste != 1) {
                            andChecker = 'failed';
                        }
                        break;
                    case 'verse':
                        if (itemArray[i].verse != 1) {
                            andChecker = 'failed';
                        }
                        break;
                    case 'crit':
                        if (itemArray[i].crit != 1) {
                            andChecker = 'failed';
                        }
                        break;
                }

                if (j == statArray.length - 1 && andChecker !== 'failed') {
                    element.style.display = 'block';
                }
            }
        }

    }
}

//Handler for drop table selector
function handleTableSelection() {
    for (var i = 0; i < dungeonCounter; i++) {
        var id = 'dungeon' + i
        var element = document.getElementById(id);
        element.style.display = "none";
    }

    if (document.getElementById('mythic0').checked) {
        for (var i = 0; i < mythic0.length; i++) {
            var id = indexMap.get(mythic0[i]);
            var element = document.getElementById(id);
            element.style.display = "block";
        }
    } else if (document.getElementById('season1').checked) {
        for (var i = 0; i < season1.length; i++) {
            var id = indexMap.get(season1[i]);
            var element = document.getElementById(id);
            element.style.display = "block";
        }
    } else if (document.getElementById('raid1').checked) {
        var id = indexMap.get(raids[1]);
        var element = document.getElementById(id);
        element.style.display = "block";
    }
}

const dropTableButtons = document.querySelectorAll('input[name="tableSelector"]');
dropTableButtons.forEach(radio => {
    radio.addEventListener('click', handleTableSelection);
});