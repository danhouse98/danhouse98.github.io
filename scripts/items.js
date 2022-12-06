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
const itemsShownPerBoss = new Map(); //Key: bossHtmlId, Val: # of items being shown currently for boss
const dungeonDisplayFlags = new Map(); //Key: dungeonHtmlId, Val: "none" or "grid" depending on display status
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
                var bossCounterString = ""; //string representation of bossCounter
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
                        bossCounterString = bossCounter.toString();
                        var bossID = dungeonID + "." + bossCounterString;
                        //builds html element for each dungeon w/ internal table for each slot
                        bossTableHTML = "<div class='boss' id='" + bossID + "'><div class='imgbox'><img src='https://wow.zamimg.com/images/wow/journal/" + bossList.imglink + "' alt='" + bossList.name + "'><h3>" + bossList.name + "</h3></div><table>" +
                            "<tr><th class ='head'>Head</th><th class='shoulder'>Shoulder</th><th class='chest'>Chest</th><th class='wrist'>Wrist</th><th class='hands'>Hands</th>" +
                            "<th class='waist'>Waist</th><th class='legs'>Legs</th><th class='feet'>Feet</th><th class='neck'>Neck</th><th class='back'>Back</th>" +
                            "<th class='ring'>Rings</th><th class='weapon'>Weapon</th><th class='off-hand'>Off-Hand</th><th class='trinket'>Trinket</th></tr><tr>";

                        //builds table elements for each slot to hold items inside of
                        for (var k = 0; k < slots.length; k++) {
                            bossSlotID = dungeonCounter.toString() + "." + bossCounterString + "." + slots[k];
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
                            //html element = currentDungeonID . currentbossCounterString . slotOfCurrentItemBeingAdded
                            bossSlotID = dungeonCounter.toString() + "." + bossCounterString + "." + itemList.slot;

                            var elem = document.getElementById(bossSlotID);

                            //builds html element for each item
                            var itemInfo = '<a id="' + itemList.id + '" href="https://www.wowhead.com/item=' + itemList.id +
                                ' data-wh-icon-added="true" class="q3" data-wh-rename-link="false">' +
                                '<span class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="item">' +
                                '<ins style="background-image: url(&quot;https://wow.zamimg.com/images/wow/icons/medium/' + itemList.imglink + '&quot;);"></ins><del></del></span></a>';

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
                //console.log([...indexMap.entries()]);
            });
            styleAllItems('block'); //show all items as "block"
        }
    });
});

//manages control panel
$(document).ready(function () {
    var classHTML = "";

    //builds class dropboxes
    $.each(classes.classList, function (i, elementText) {
        classHTML += "<option data-class-name ='" + elementText.class + "' value='class" + classCounter + "'>" + elementText.class + "</option>";
        var subclassHTML = "<select name='" + elementText.class + "' id = 'class" + classCounter + "' class ='subclassBox'>" +
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
    slotHTML += "</form><br><button type='button' onclick='slotUpdate()' value='Filter Slots'>Filter Slots</button>" +
        "<br><button type='button' onclick='selectSlotFilter(&quot;true&quot;)' value='selectAll'>Select All Slots</button>" +
        "<button type='button' onclick='selectSlotFilter(&quot;false&quot;)' value='clearAll'>Clear All Slots</button>";

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

    dungeonHider();
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

    //console.log(flag);

    var statArray = [];

    //stat filter handler
    for (var i = 0; i < inputElements.length; i++) {
        checkboxValue = inputElements[i].value;
        //console.log(checkboxValue + " : " + inputElements[i].checked);
        changedElements = document.getElementsByClassName(checkboxValue);

        //gets all wanted stats
        if (inputElements[i].checked) {
            statArray.push(inputElements[i].value);
        }
    }

    //TODO update to account of filteredItemArray
    //Loop through itemArray, hide all items then show all relevent items
    if (filteredItemArray.length == 0) {
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
                    //console.log(statArray[j]);
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
                    //console.log(statArray[j]);
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
    dungeonHider();
}


//Function for Mythic 0 radio button
function showMythic0() {
    hideAllDungeons();
    for (var i = 0; i < mythic0.length; i++) {
        var id = indexMap.get(mythic0[i]);
        var element = document.getElementById(id);
        element.style.display = "block";
    }

    dungeonHider();
}

//Funciton for Season 1 radio button
function showSeason1() {
    hideAllDungeons();
    for (var i = 0; i < season1MythicPlus.length; i++) {
        var id = indexMap.get(season1MythicPlus[i]);
        var element = document.getElementById(id);
        element.style.display = "block";
    }

    dungeonHider();
}

//Function for Raid 1 radio button
function showRaid1() {
    hideAllDungeons();
    var id = indexMap.get(raids[0]);
    var element = document.getElementById(id);
    element.style.display = "block";

    dungeonHider();
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

    dungeonHider();
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
        element = document.getElementById(itemArray[i].id);
        element.style.display = flag;
    }
}

//Sets all slots to either checked or unchecked
//flag- either true or false
function selectSlotFilter(flag) {
    for (var i = 0; i <= 13; i++) {
        var slotId = "slot" + i.toString()
        if (flag === 'true') {
            document.getElementById(slotId).checked = 'true';
        } else {
            document.getElementById(slotId).checked = false;
        }
    }
}

//TODO clearFilter(){} to show all items based on filteredItems()
function clearStatFilter() {
    document.getElementById("stat0").checked = true;
    document.getElementById("stat1").checked = true;
    document.getElementById("stat2").checked = true;
    document.getElementById("stat3").checked = true;
    document.getElementById("or").checked = true;
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
    dungeonHider();
}

//fills filteredItemArray based on selected class
function subclassListener() {
    //empties array
    filteredItemArray.length = 0;
    currentTags.length = 0;
    //retrieves selected class
    var selectedClass = document.getElementById("classDropdown").value;
    //retrieves selected subclass
    var selectedSubclass = document.getElementById(selectedClass).value;

    //if subclass is selected
    if (selectedSubclass != "none") {
        switch (selectedSubclass) {
            //Shamman 
            case "Elemental":
                var tags = ['set4', 'all', 'mail', 'int', 'intagi', 'intdamage', 'rangeddps', 'int1hmace', 'intdagger', 'int2hstaff', 'intoffhand', 'shield']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break; //end case
            case "Enhancement":
                var tags = ['set4', 'all', 'mail', 'agi', 'intagi', 'agistr', 'agistrdps', 'agidps', 'meleedps', 'agi1haxe', 'agifist', 'agi1hmace']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break; //end case
            case "Restoration": //Shaman and Druid Check
                if (selectedClass === "class0") { //Resto Shamman
                    var tags = ['set4', 'all', 'mail', 'int', 'intagi', 'healer', 'int1hmace', 'intdagger', 'int2hstaff', 'intoffhand', 'shield']; //tags for subclass
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                } else if (selectedClass === "class7") { //Resto Druid
                    var tags = ['set3', 'all', 'leather', 'int', 'intagi', 'healer', 'int1hmace', 'int2hmace', 'int2hstaff', 'intoffhand', 'shield']; //tags for subclass
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                }
                break;

            //Death Knight
            case "Blood":
                var tags = ['set1', 'all', 'plate', 'str', 'agistr', 'tank', 'str2hsword', 'str2haxe', 'str2hmace', 'str2hpolearm']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Frost": //dk and mage case
                if (selectedClass === "class1") { //dk case
                    var tags = ['set1', 'all', 'plate', 'str', 'agistr', 'strdps', 'meleedps', 'str2hsword', 'str2haxe', 'str2hmace', 'str2hpolearm', 'str1haxe', 'str1hmace', 'str1hsword']; //tags for subclass
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                } else if (selectedClass === "class5") { //mage case
                    var tags = ['set3', 'all', 'cloth', 'int', 'intagi', 'intdamage', 'rangeddps', 'intdagger', 'int1hsword', 'int2hstaff', 'intoffhand', 'intwand'];
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                }
                break;
            case "Unholy":
                var tags = ['set1', 'all', 'plate', 'str', 'agistr', 'strdps', 'meleedps', 'str2hsword', 'str2haxe', 'str2hmace', 'str2hpolearm']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;

            //Monk
            case "Mistweaver":
                var tags = ['set2', 'all', 'leather', 'int', 'intagi', 'healer', 'int2hstaff', 'int2hpolearm', 'intoffhand', 'int1hmace']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Brewmaster":
                var tags = ['set2', 'all', 'leather', 'agi', 'intagi', 'tank', 'agi2hstaff', 'agi2hpolearm', 'agi1hmace', 'agi1haxe', 'agi1hsword']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Windwalker":
                var tags = ['set2', 'all', 'leather', 'agi', 'intagi', 'agidps', 'agistrdps', 'meleedps', 'agi2hstaff', 'agi2hpolearm', 'agi1hmace', 'agi1haxe', 'agi1hsword']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;


            //Demon Hunter
            case "Havoc":
                var tags = ['set1', 'all', 'leather', 'agi', 'intagi', 'agistr', 'agidps', 'agistrdps', 'meleedps', 'agi1haxe', 'agifist', 'agi1hsword', 'warglaive']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Vengence":
                var tags = ['set1', 'all', 'leather', 'agi', 'intagi', 'agistr', 'tank', 'agi1haxe', 'agifist', 'agi1hsword', 'warglaive']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;


            //Warrior
            case "Protection": //warrior and paladin case
                //1hsword 1haxe 2hsword 2haxe 1hmace 1hsword polearms
                if (selectedClass === "class4") { //warrior case
                    var tags = ['set2', 'all', 'plate', 'str', 'agistr', 'tank', 'str1haxe', 'str1hmace', 'str1hsword', 'shield']; //tags for subclass
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                } else if (selectedClass === "class10") { //paladin case
                    var tags = ['set4', 'all', 'plate', 'str', 'agistr', 'strdps', 'tank', 'str1haxe', 'str1hmace', 'str1hsword', 'shield']; //tags for subclass
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                }
                break;
            case "Arms":
                var tags = ['set2', 'all', 'plate', 'str', 'agistr', 'strdps', 'meleedps', 'str2hsword', 'str2haxe', 'str2hmace', 'str2hpolearm']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Fury":
                var tags = ['set2', 'all', 'plate', 'str', 'agistr', 'strdps', 'meleedps', 'str2hsword', 'str2haxe', 'str2hmace', 'str2hpolearm', 'str1haxe', 'str1hmace', 'str1hsword']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;

            //Mage
            //case "Frost": found under DK
            case "Fire":
            case "Arcane":
                var tags = ['set3', 'all', 'cloth', 'int', 'intagi', 'intdamage', 'rangeddps', 'intdagger', 'int1hsword', 'int2hstaff', 'intoffhand', 'intwand'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            //daggers 1hswords offhand wands staffs

            //Hunter
            case "Survival":
                var tags = ['set3', 'all', 'mail', 'agi', 'intagi', 'agistrdps', 'agistr', 'meleedps', 'agi2haxe', 'agi2hstaff', 'agi2hpolearm'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Marksmanship":
            case "Beast Mastery":
                var tags = ['set3', 'all', 'mail', 'agi', 'intagi', 'agistrdps', 'agistr', 'rangeddps', 'ranged'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            //ranged

            //Druid
            case "Balance":
                var tags = ['set3', 'all', 'leather', 'int', 'intagi', 'intdamage', 'rangeddps', 'int1hmace', 'intdagger', 'int2hmace', 'int2hstaff', 'intoffhand'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Feral":
                var tags = ['set3', 'all', 'leather', 'agi', 'intagi', 'agistrdps', 'agidps', 'agistr', 'meleedps', 'agi2hstaff', 'agi2hpolearm'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Guardian":
                var tags = ['set3', 'all', 'leather', 'agi', 'intagi', 'agistr', 'tank', 'agi2hstaff', 'agi2hpolearm'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            //resto case found under //Shaman

            //Rouge
            case "Outlaw":
                var tags = ['set2', 'all', 'leather', 'agi', 'intagi', 'agistrdps', 'agidps', 'agistr', 'meleedps', 'agifist', 'agi1hmace', 'agi1haxe', 'agi1hsword'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Assassination":
            case "Subtlety":
                var tags = ['set2', 'all', 'leather', 'agi', 'intagi', 'agistrdps', 'agidps', 'agistr', 'meleedps', 'agidagger'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;

            //Priest
            case "Discipline":
                var tags = ['set4', 'all', 'cloth', 'int', 'intagi', 'intdamage', 'rangeddps', 'healer', 'int1hmace', 'intdagger', 'int2hstaff', 'intoffhand', 'intwand'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Holy": //priest and paladin case
                if (selectedClass === "class9") {
                    var tags = ['set4', 'all', 'cloth', 'int', 'intagi', 'healer', 'int1hmace', 'intdagger', 'int2hstaff', 'intoffhand', 'intwand'];
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                } else if (selectedClass === "class10") {
                    var tags = ['set4', 'all', 'plate', 'int', 'intagi', 'healer', 'int1hmace', 'int1hsword', 'intshield'];
                    for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                        currentTags.push(tags[i]);
                    }
                }
                break;
            case "Shadow":
                var tags = ['set4', 'all', 'cloth', 'int', 'intagi', 'intdamage', 'rangeddps', 'int1hmace', 'intdagger', 'int2hstaff', 'intoffhand', 'intwand'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;

            //Paladin
            //case"Holy": found under priest
            //case"Protection": found under warrior
            case "Retribution":
                var tags = ['set4', 'all', 'plate', 'str', 'agistr', 'strdps', 'agistrdps', 'meleedps', 'str2hsword', 'str2haxe', 'str2hmace', 'str2hpolearm']; //tags for subclass
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;

            //Warlock
            //daggers 1hswords offhand wands staffs
            case "Affliction":
            case "Demonology":
            case "Destruction":
                var tags = ['set1', 'all', 'cloth', 'int', 'intagi', 'intdamage', 'rangeddps', 'intdagger', 'int1hsword', 'int2hstaff', 'intoffhand', 'intwand'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;

            //Evoker
            case "Devastation":
                var tags = ['set2', 'all', 'mail', 'int', 'intagi', 'intdamage', 'rangeddps', 'int1hsword', 'intmace', 'int2hstaff', 'intoffhand', 'evoker'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            case "Preservation":
                var tags = ['set2', 'all', 'mail', 'int', 'intagi', 'healer', 'int1hsword', 'intdagger', 'intmace', 'int2hstaff', 'intoffhand', 'evoker'];
                for (var i = 0; i < tags.length; i++) { //pushing tags to currentTags for use later
                    currentTags.push(tags[i]);
                }
                break;
            default:
        }

        //Go through itemArray and check currentTags against item.type
        //Add appropriate items to filteredItemArray
        for (var i = 0; i < itemArray.length; i++) {
            if (currentTags.includes(itemArray[i].type)) {
                filteredItemArray.push(itemArray[i]);
            }
        }

        /*(TEST) Print currentTags to see if they are updating correctly
        console.log(currentTags);
        for (var i = 0; i < filteredItemArray.length; i++) {
            console.log(filteredItemArray[i].id + ":" + filteredItemArray[i].type);
        }
        (TESTEND)
        */

        //show only filtered items
        showFilteredItems();
    } else { //if no subclass is selected show all items
        console.log("Nothing to filter!")
        styleAllItems('block');
    }
};

//get all subclass dropdown elements to add listeners to
function subclassBatch() {
    var subclassSet = document.getElementsByClassName("subclassBox");
    for (var i = 0; i < subclassSet.length; i++) {
        subclassSet[i].addEventListener('change', subclassListener, false);
    }
}

//listener for subclassBatch
window.addEventListener("load", subclassBatch, false);

//automatically shows and hides dungeons based on if there is currently something shown via filter
function dungeonHider() {
    itemsShownPerBoss.clear();
    dungeonDisplayFlags.clear();
    //get items via our arrays and get parent boss element with dom controls
    for (var i = 0; i < itemArray.length; i++) {
        var tdElement = document.getElementById(itemArray[i].id).parentElement; //td our item sits in
        var trElement = tdElement.parentElement; //tr our td sits in
        var tbodyElement = trElement.parentElement; //tbody our tr sits in
        var tableElement = tbodyElement.parentElement; //table our tbody sits in
        var bossElement = tableElement.parentElement; // our wanted boss element
        var bossElementID = bossElement.id;


        //check if item.style.display is "block"
        //if item is showing and slot the item is in is not hidden
        if (document.getElementById(itemArray[i].id).style.display == "block" && tdElement.style.display != "none") {
            if (itemsShownPerBoss.has(bossElementID)) {
                var currentCount = itemsShownPerBoss.get(bossElementID) + 1;
                itemsShownPerBoss.set(bossElementID, currentCount);
            } else { //do this if shown and key does not yet exist
                itemsShownPerBoss.set(bossElementID, 1);
            }
        } else { //if display is "none"
            if (itemsShownPerBoss.has(bossElementID)) { //do nothing if true
            } else { //do this if hidden and key not yet exists
                itemsShownPerBoss.set(bossElementID, 0);
            }
        }
    }

    //check map at end and hide all bosses where value == 0;
    //then add up the total to map dungeonDisplayFlags
    itemsShownPerBoss.forEach((value, key) => {

        //add up itemsShownPerBoss into dungeonDisplayFlags
        var lastCharOfElementID = "";
        var dungeonID = key; //dungeonID, yet to be extracted
        for (var i = 1; lastCharOfElementID != "." && dungeonID.length != 0; i++) {
            lastCharOfElementID = dungeonID.slice(-1);
            dungeonID = dungeonID.slice(0, -1);
        }// we now have the properDungeonID

        //console.log("DungeonID:" + dungeonID);

        //complete check for if to display or hide boss <div>
        if (document.getElementById(key) != null) {
            if (value == 0) { //if we have no entries
                document.getElementById(key).style.display = "none";
                if (dungeonDisplayFlags.has(dungeonID)) { //if true check do nothing
                } else { //if no entry, Map(Key, "none")
                    dungeonDisplayFlags.set(dungeonID, "none");
                }
            } else { //if this dungeon has entries
                document.getElementById(key).style.display = "grid"; //display as grid to keep integrity of layout
                dungeonDisplayFlags.set(dungeonID, "grid"); //display as grid to keep integrity of layout
            }
        } else {
            console.log("Invalid ID:" + key);
        }
    });

    //Check each dungeon in map and show or hide
    dungeonDisplayFlags.forEach((value, key) => { //Key: dungeonID, val: "none" or "grid"
        document.getElementById(key).style.display = value;
    })

    dungeonHiderRadioCheck();
}

function dungeonHiderRadioCheck() {
    hideAllDungeons();
    if ($('#all').is(':checked')) { //Show all if true
        //for each dungeonDisplayFlags show dungeon if value == block
        dungeonDisplayFlags.forEach((value, key) => { //Key: dungeonID value: "block" or "none"
            document.getElementById(key).style.display = value;
        })

    } else if ($('#mythic0').is(':checked')) {//show m0 dungeons if true
        //for each dungeon in mythic 0, get id from indexMap and use this id to display with dungeonDisplayFlags
        for (var i = 0; i < mythic0.length; i++) {
            var dungeonID = indexMap.get(mythic0[i]);
            document.getElementById(dungeonID).style.display = dungeonDisplayFlags.get(dungeonID);
        }

    } else if ($('#season1').is(':checked')) {//show season1 dungeons if true
        //for each dungeon in season1MythicPlus, get id from indexMap and use this id to display with dungeonDisplayFlags
        for (var i = 0; i < mythic0.length; i++) {
            var dungeonID = indexMap.get(season1MythicPlus[i]);
            document.getElementById(dungeonID).style.display = dungeonDisplayFlags.get(dungeonID);
        }
    } else if ($('#raid1').is(':checked')) { //show raid1 if true
        //for each dungeon in raids, get id from indexMap and use this id to display with dungeonDisplayFlags
        for (var i = 0; i < raids.length; i++) {
            var dungeonID = indexMap.get(raids[i]);
            document.getElementById(dungeonID).style.display = dungeonDisplayFlags.get(dungeonID);
        }
    }
}