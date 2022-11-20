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

var slots = ['head', 'shoulder', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'neck', 'back', 'ring', 'weapon', 'trinket'];


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
            var dungeonCounter = 0;
            $.each(data, function () {
                var dungeonID = "";
                var bossID = "";
                var bossSlotID = "";
                //dungeonList
                $.each(this, function (key, dungeonList) {
                    var bossCounter = 0;
                    dungeonID = dungeonCounter.toString();
                    var bossTableHTML = "<div class= 'dungeon' id= 'dungeon" + dungeonID + "'><h2>" + dungeonList.dungeon_name + "</h2>";
                    $('#dungeonList').append(bossTableHTML);

                    //boss list
                    $.each(dungeonList.bosses, function (key2, bossList) {
                        bossID = bossCounter.toString();

                        bossTableHTML = "<div class='boss'><div class='imgbox'><img src='https://wow.zamimg.com/images/wow/journal/" + bossList.imglink + "' alt='" + bossList.name + "'><h3>" + bossList.name + "</h3></div><table>" +
                            "<tr><th class ='head'>Head</th><th class='shoulder'>Shoulder</th><th class='chest'>Chest</th><th class='wrist'>Wrist</th><th class='hands'>Hands</th>" +
                            "<th class='waist'>Waist</th><th class='legs'>Legs</th><th class='feet'>Feet</th><th class='neck'>Neck</th><th class='back'>Back</th>" +
                            "<th class='neck'>Rings</th><th class='weapon'>Weapon</th><th class='trinket'>Trinket</th></tr><tr>";

                        for (var k = 0; k < slots.length; k++) {
                            bossSlotID = dungeonID + "." + bossID + "." + slots[k];
                            bossTableHTML += "<td id='" + bossSlotID + "' class='" + slots[k] + "'></td>";
                        }

                        bossTableHTML += "</tr></table></div><br>";
                        $("#dungeonList").append(bossTableHTML);

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

    slotHTML = "<form>";
    //Slot Table
    for (var i = 0; i < slots.length; i++) {
        var slotName = slots[i];
        slotName = slotName.charAt(0).toUpperCase() + slotName.slice(1);
        slotHTML += "<input type='checkbox' id='slot" + i + "' value='" + slots[i] + "' name ='slot' class='slotCheckbox' checked>" +
            "<label for ='stat" + i + "'>" + slotName + "</label><br>";
    }
    slotHTML += "<button type='button' onclick='slotUpdate()' value='Filter Slots'>Filter Slots</button>";

    $('#statPanel').append(slotHTML);
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
        console.log(checkboxValue + " : " + inputElements[i].checked);
        changedElements = document.getElementsByClassName(checkboxValue);
        if (inputElements[i].checked) {
            for(var j = 0; j  < changedElements.length; j++){
                changedElements[j].style.display = "block";
            }
        } else {
            for(var j = 0; j  < changedElements.length; j++){
                changedElements[j].style.display = "none";
            }
        }
    }
}
