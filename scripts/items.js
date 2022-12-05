/*
id - holds item id
int, str, agi, mastery, verse, crit, haste- shows 0 if stat is not present, 1 if stat is present on item
slot - holds slot the item is equiped to
type - holds tag for item
    armor - armor type (ie plate, cloth, leather)
    trinket - type of trinket
    weapon - type of weapon w/ stat modifier if applicable
*/
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

const itemArray = []; //Holds all Item objects
const filteredItemArray = []; //Holds filted Item objects based on classPanel
const currentTags = []; //Holds tags defined but currently selected subclass
const indexMap = new Map(); //Key: Dungeon Name, Val: html ID for each dungeon <div>
var classCounter = 0; //Counts number of classes
var dungeonCounter = 0; //Counts number of dungeons

//Lists each available slot, used to build slotPanel
var slots = ['head', 'shoulder', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'neck', 'back', 'ring', 'weapon', 'off-hand', 'trinket'];

//Lists for each filter for each button in seasonPanel
var mythic0 = ["Ruby Life Pools", "Brackenhide Hollow", "The Nokhud Offensive", "Uldaman: Legacy of Tyr", "Algeth'ar Academy", "The Azure Vault", "Halls of Infusion", "Neltharus"];
var season1MythicPlus = ["Ruby Life Pools", "The Nokhud Offensive", "The Azure Vault", "Algeth'ar Academy", "Halls of Valor", "Court of Stars", "Shadowmoon Burial Grounds", "Temple of the Jade Serpent"];
var raids = ["Vault of The Incarnates"];

//Holds class list with all relevant cooresponding subclasses, used to build classPanel
var classes = {
    "classList": [{ "class": "Shaman", "subclass": [{ "name": "Elemental" }, { "name": "Enhancement" }, { "name": "Restoration" }] },
    { "class": "Death Knight", "subclass": [{ "name": "Blood" }, { "name": "Frost" }, { "name": "Unholy" }] },
    { "class": "Monk", "subclass": [{ "name": "Mistweaver" }, { "name": "Brewmaster" }, { "name": "Windwalker" }] },
    { "class": "Demon Hunter", "subclass": [{ "name": "Havoc" }, { "name": "Vengence" }] },
    { "class": "Warrior", "subclass": [{ "name": "Protection" }, { "name": "Arms" }, { "name": "Fury" }] },
    { "class": "Mage", "subclass": [{ "name": "Frost" }, { "name": "Fire" }, { "name": "Arcane" }] },
    { "class": "Hunter", "subclass": [{ "name": "Survival" }, { "name": "Marksmanship" }, { "name": "Beast Mastery" }] },
    { "class": "Druid", "subclass": [{ "name": "Balance" }, { "name": "Feral" }, { "name": "Guardian" }, { "name": "Restoration" }] },
    { "class": "Rouge", "subclass": [{ "name": "Outlaw" }, { "name": "Assassination" }, { "name": "Subtlety" }] },
    { "class": "Priest", "subclass": [{ "name": "Discipline" }, { "name": "Holy" }, { "name": "Shadow" }] },
    { "class": "Paladin", "subclass": [{ "name": "Holy" }, { "name": "Protection" }, { "name": "Retribution" }] },
    { "class": "Warlock", "subclass": [{ "name": "Affliction" }, { "name": "Demonology" }, { "name": "Destruction" }] },
    { "class": "Evoker", "subclass": [{ "name": "Devastation" }, { "name": "Preservation" }] }]
};





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
            //Clears dungeonList before building page
            $("#dungeonList").html("");
            //TODO rename id tag
            //dungeon List
            $.each(data, function () {
                var dungeonID = ""; //string representation of dungeonCounter
                var bossID = ""; //string representation of bossCounter
                var bossSlotID = ""; //id for each slot <div>
                //each dungeon
                $.each(this, function (key, dungeonList) {
                    var bossCounter = 0; //counts number of bosses per dungeon
                    dungeonID = "dungeon" + dungeonCounter.toString(); //builds ID for dungeon element
                    var bossTableHTML = "<div class= 'dungeon' id= '" + dungeonID + "'><h2>" + dungeonList.dungeon_name + "</h2>"; //Creates <div> for each dungeon
                    $('#dungeonList').append(bossTableHTML); //Append each dungeon entry

                    indexMap.set(dungeonList.dungeon_name, dungeonID); //Map(name,htmlID) for each dungeon

                    //each boss per dungeon
                    $.each(dungeonList.bosses, function (key2, bossList) {
                        bossID = bossCounter.toString();

                        //builds html element for each dungeon w/ internal table for each slot
                        bossTableHTML = "<div class='boss'><div class='imgbox'><img src='https://wow.zamimg.com/images/wow/journal/" + bossList.imglink + "' alt='" + bossList.name + "'><h3>" + bossList.name + "</h3></div><table>" +
                            "<tr><th class ='head'>Head</th><th class='shoulder'>Shoulder</th><th class='chest'>Chest</th><th class='wrist'>Wrist</th><th class='hands'>Hands</th>" +
                            "<th class='waist'>Waist</th><th class='legs'>Legs</th><th class='feet'>Feet</th><th class='neck'>Neck</th><th class='back'>Back</th>" +
                            "<th class='ring'>Rings</th><th class='weapon'>Weapon</th><th class='off-hand'>Off-Hand</th><th class='trinket'>Trinket</th></tr><tr>";

                        //builds table elements for each slot to hold items inside of
                        for (var k = 0; k < slots.length; k++) {
                            bossSlotID = dungeonCounter.toString() + "." + bossID + "." + slots[k];
                            bossTableHTML += "<td id='" + bossSlotID + "' class='" + slots[k] + "'></td>";
                        }
                        //closes the table to complete the element
                        bossTableHTML += "</tr></table></div></div>";
                        //gets appropriate id to add the table to
                        var appendID = "#" + dungeonID;
                        //append to the correct boss element
                        $(appendID).append(bossTableHTML);

                        //each item per boss
                        $.each(bossList.drops, function (key3, itemList) {
                            //html element = currentDungeonID . currentBossID . slotOfCurrentItemBeingAdded
                            bossSlotID = dungeonCounter.toString() + "." + bossID + "." + itemList.slot;

                            var elem = document.getElementById(bossSlotID);

                            //builds html element for each item
                            var itemInfo = '<a id="' + itemList.id + '" href="https://www.wowhead.com/item=' + itemList.id +
                                ' data-wh-icon-added="true" class="q3" data-wh-rename-link="false">' +
                                '<span class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="item">' +
                                '<ins style="background-image: url(&quot;https://wow.zamimg.com/images/wow/icons/medium/' + itemList.imglink + '&quot");"></ins><del></del></span></a>';

                            if (elem != null) { //adds item
                                elem.insertAdjacentHTML('beforeend', itemInfo);
                            } else { //prints to console if ID is invalid
                                console.log("Invalid entry - ID : " + itemList.id);
                            }

                            //Filling out itemArray with item info
                            var currentItem = new Item();
                            currentItem.id = itemList.id;
                            currentItem.type = itemList.type;

                            //sets stat flags for each item object
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
                console.log([...indexMap.entries()]);
            });
        }
    });
});

//manages control panel
$(document).ready(function () {
    var classHTML = "";

    //builds class dropboxes
    $.each(classes.classList, function (i, elementText) {
        classHTML += "<option data-class-name ='" + elementText.class + "' value='class" + classCounter + "'>" + elementText.class + "</option>";
        var subclassHTML = "<select name='" + elementText.class + "' id = 'class" + classCounter + "'>" +
            "<option value='none'>Select Subclass</option>";

        //builds subclass dropboxes, one dropbox for each class
        $.each(elementText.subclass, function (j, subElementText) {
            subclassHTML += "<option value='" + subElementText.name + "'>" + subElementText.name + "</option>";
        });
        subclassHTML += "</select>";
        $("#subclassDropdown").append(subclassHTML);
        if (classCounter != 0) {
            var id = "class" + classCounter;
            var e = document.getElementById(id);
            e.style.display = "none";
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

//manages dynamic dropdown boxes for subclassDropdown
window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("classDropdown").addEventListener("change", function () {
        //returns value of the selected class
        var classElementValue = document.getElementById("classDropdown").value;

        for (var i = 0; i < classCounter; i++) {
            var id = "class" + i;
            //console.log(id);
            var element = document.getElementById(id);

            if (classElementValue === id) {
                element.style.display = "block";
                //change id for change handler
                id = "#" + id;

                //changes selected subclass value to "none" whenever a new dropdown in shown
                $(id).val("none");
                $(id).change();
            } else {
                element.style.display = "none";
            }
        }
    })
});

//Manages the hiding and showing of each "slot" based on slotPanel
function slotUpdate() {
    var checkboxValue = "";
    var inputElements = document.getElementsByClassName('slotCheckbox');
    var changedElements;
    for (var i = 0; i < inputElements.length; i++) {
        checkboxValue = inputElements[i].value;

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

    //TODO update to account of filteredItemArray
    //Loop through itemArray, hide all items then show all relevent items
    if (filteredItemArray.length = 0) {
        for (var i = 0; i < itemArray.length; i++) {
            var id = itemArray[i].id;

            /*(TEST)make sure id & vals are working properly
            console.log(id + " m: " + itemArray[i].mastery + " v: " + itemArray[i].verse + ' c: ' + itemArray[i].crit + ' h: ' + itemArray[i].haste);
            */

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
    } else { //use filteredItemArray
        for (var i = 0; i < filteredItemArray.length; i++) {
            var id = filteredItemArray[i].id;

            /*(TEST)make sure id & vals are working properly
            console.log(id + " m: " + filteredItemArray[i].mastery + " v: " + filteredItemArray[i].verse + ' c: ' + filteredItemArray[i].crit + ' h: ' + filteredItemArray[i].haste);
            */

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
                            if (filteredItemArray[i].mastery == 1) {
                                orChecker = 'passed';
                                element.style.display = 'block';
                            }
                            break;
                        case 'haste':
                            if (filteredItemArray[i].haste == 1) {
                                orChecker = 'passed';
                                element.style.display = 'block';
                            }
                            break;
                        case 'verse':
                            if (filteredItemArray[i].verse == 1) {
                                orChecker = 'passed';
                                element.style.display = 'block';
                            }
                            break;
                        case 'crit':
                            if (filteredItemArray[i].crit == 1) {
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
                            if (filteredItemArray[i].mastery != 1) {
                                andChecker = 'failed';
                            }
                            break;
                        case 'haste':
                            if (filteredItemArray[i].haste != 1) {
                                andChecker = 'failed';
                            }
                            break;
                        case 'verse':
                            if (filteredItemArray[i].verse != 1) {
                                andChecker = 'failed';
                            }
                            break;
                        case 'crit':
                            if (filteredItemArray[i].crit != 1) {
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
}

/*
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
*/

//Function for Mythic 0 radio button
function showMythic0() {
    hideAllDungeons();
    for (var i = 0; i < mythic0.length; i++) {
        var id = indexMap.get(mythic0[i]);
        var element = document.getElementById(id);
        element.style.display = "block";
    }
}

//Funciton for Season 1 radio button
function showSeason1() {
    hideAllDungeons();
    for (var i = 0; i < season1MythicPlus.length; i++) {
        var id = indexMap.get(season1MythicPlus[i]);
        var element = document.getElementById(id);
        element.style.display = "block";
    }
}

//Function for Raid 1 radio button
function showRaid1() {
    hideAllDungeons();
    var id = indexMap.get(raids[0]);
    var element = document.getElementById(id);
    element.style.display = "block";
}

//Hides all dungeon elements
function hideAllDungeons() {
    for (var i = 0; i < dungeonCounter; i++) {
        var id = 'dungeon' + i
        var element = document.getElementById(id);
        element.style.display = "none";
    }
}

//Shows all dungeon elements
function showAllDungeons() {
    for (var i = 0; i < dungeonCounter; i++) {
        var id = 'dungeon' + i
        var element = document.getElementById(id);
        element.style.display = "block";
    }
}

//Resets stat filtering
function resetStatFilter() {
    //clear stat selectors
    var statElements = document.getElementsByClassName('statCheckbox');
    for (var i = 0; i < statElements.length; i++) {
        statElements[i].checked = true;
    }

    document.getElementById('or').checked = true

    styleAllItems("block");
}

/*Shows or hides all items in itemArray
* String flag - either "block" or "none"
 */
function styleAllItems(flag) {
    for (var i = 0; i < itemArray.length; i++) {
        document.getElementById(itemArray[i].id).style.display = flag;
    }
}

//TODO clearFilter(){} to show all items based on filteredItems()
function clearStatFilter() {
    document.getElementById("stat0").checked = true;
    document.getElementById("stat1").checked = true;
    document.getElementById("stat2").checked = true;
    document.getElementById("stat3").checked = true;
    if (filteredItemArray.length != 0) {
        showFilteredItems();
    } else {
        styleAllItems('block');
    }
}

//swap from showing all items to showing filtered items only
function showFilteredItems() {
    styleAllItems("none");
    for (var i = 0; i < filteredItemArray.length; i++) {
        document.getElementById(filteredItemArray[i].id).style.display = "block";
    }
}

//TODO Fill out switches
