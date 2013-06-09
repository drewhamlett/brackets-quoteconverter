/*jslint vars: true, nomen: true */
/*global define, $, brackets */

define(function (require, exports, module) {

    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Menus = brackets.getModule("command/Menus"),
        SINGLE_TO_DOUBLE = "me.drewh.singletodouble",
        DOUBLE_TO_SINGLE = "me.drewh.doubletosingle";

    /**
     * ReplaceAll by Fagner Brack (MIT Licensed)
     * Replaces all occurrences of a substring in a string
     */
    function replaceAll(str, token, newToken, ignoreCase) {

        var _token;
        var i = -1;

        if (typeof token === "string") {

            if (ignoreCase) {

                _token = token.toLowerCase();

                while ((i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0)) !== -1) {
                    str = str.substring(0, i) +
                        newToken +
                        str.substring(i + token.length);
                }

            } else {
                return str.split(token).join(newToken);
            }

        }
        return str;
    }


    /**
     * Format
     */

    function format(options) {

        options = options || {};

        var isSelection = false;
        var unformattedText;

        var editor = EditorManager.getCurrentFullEditor(),
            selectedText = editor.getSelectedText(),
            selection = editor.getSelection();

        if (selectedText.length > 0) {
            isSelection = true;
            unformattedText = selectedText;
        } else {
            unformattedText = DocumentManager.getCurrentDocument().getText();
        }

        var cursor = editor.getCursorPos(),
            scroll = editor.getScrollPos(),
            doc = DocumentManager.getCurrentDocument();

        doc.batchOperation(function () {

            var formattedText,
                single = options.single;

            if (single) {
                formattedText = replaceAll(unformattedText, '"', "'");
            } else {
                formattedText = replaceAll(unformattedText, "'", '"');
            }

            if (isSelection) {
                doc.replaceRange(formattedText, selection.start, selection.end);
            } else {
                doc.setText(formattedText);
            }

            editor.setCursorPos(cursor);
            editor.setScrollPos(scroll.x, scroll.y);
        });
    }

    CommandManager.register("Double to single quote", DOUBLE_TO_SINGLE, function () {
        format({
            single: true
        });
    });

    CommandManager.register("Single to double quote", SINGLE_TO_DOUBLE, function () {
        format();
    });

    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

    var singleToDoubleCmd = {
        windowsCommand: {
            key: "Ctrl-Alt-'",
            platform: "win"
        },
        macCommand: {
            key: "Cmd-Alt-'",
            platform: "mac"
        }
    };

    var doubleToSingleCmd = {
        windowsCommand: {
            key: "Ctrl-Alt-Shift-'",
            platform: "win"
        },
        macCommand: {
            key: "Cmd-Alt-Shift-'",
            platform: "mac"
        }
    };

    var singleToDouble = [
        singleToDoubleCmd.windowsCommand,
        singleToDoubleCmd.macCommand
    ];

    var doubleToSingle = [
        doubleToSingleCmd.windowsCommand,
        doubleToSingleCmd.macCommand
    ];

    menu.addMenuItem(DOUBLE_TO_SINGLE, singleToDouble);
    menu.addMenuItem(SINGLE_TO_DOUBLE, doubleToSingle);
});