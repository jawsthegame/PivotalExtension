//require jquery, jqueryui, facebox, query.form.js, jquery.quickflip.js
function buildReplaceCallback(id, additionalFunction) {
    return function (html) {
        var rootSelector = '#' + id;
        $(rootSelector).replaceWith(html);
        bindUIEvents(rootSelector);
        if (additionalFunction != undefined) {
            additionalFunction();
        }
    };
}

//needed to hold update target for facebox
var updateTargetId;

function bindUIEvents(rootSelector) {
    rootSelector = rootSelector || '';
    var rootDefined = rootSelector.length > 0;
    if (rootDefined) rootSelector = rootSelector + ' ';//space for all descendants, > for children
    $(rootSelector + '.flippable').quickFlip();
    $(rootSelector + '.task-column').sortable({
        handle: 'h3',
        update: function (event, ui) {
            arr = $(this).sortable('toArray').toString();
            $.ajax({
                type: 'PUT',
                url: '/Task/ReOrder',
                data: 'taskArray=' + arr
            });
        }
    });
    $(rootSelector + '.task-column').selectable({
        filter: 'div.task:not(.complete)',
        selected: function (event, ui) {
            var deselector = 'td.task-column:not(#' + $(ui.selected).parent().attr('id') + ')';
            $(deselector).find('.ui-selected').removeClass('ui-selected');
        }
    });

    $(rootSelector + 'a.facebox').unbind('click');
    $(rootSelector + 'a.facebox').bind('click', function () {
        updateTargetId = this.rel;
    }).facebox();

    if (!rootDefined) { //assume that presence of root selector means document events already bound
        $(document).bind('reveal.facebox', function () {
            $('.async-form').ajaxForm(function (html) {
                buildReplaceCallback(updateTargetId, function () {
                    $.facebox.close();
                    updateTargetId = null;
                })(html);
            });

            $('.facebox-cancel').bind('click', function () {
                $.facebox.close();
                updateTargetId = null;
                return false;
            });
        });
    }
}

function SignUpForTask() {
    initials = prompt('Enter your initials in AA/BB format (an empty string will clear existing assignment):', '');
    var array = [];
    var storyId;
    if (initials != null) {
        $('div.ui-selected').each(function () {
            var id = $(this).attr('id');
            var items = id.split('-');
            storyId = items[0] + '-' + items[1];
            array.push(id);
        });
        var queryString = $.param({ initials: initials, fullIds: array }, true);
        $.ajax({
            type: 'PUT',
            url: '/Task/SignUp',
            data: queryString,
            success: buildReplaceCallback(storyId)
        });
    }
}

function RemoveTask(id) {
    var items = id.split('-');
    $.ajax({
        type: 'DELETE',
        url: '/Stories/DeleteTask',
        data: 'projectId=' + items[0] + '&storyId=' + items[1] + '&taskId=' + items[2],
        success: buildReplaceCallback(items[0] + '-' + items[1])
    });
}

function CompleteTask(id, completed) {
    var items = id.split('-');
    $.ajax({
        type: 'PUT',
        url: '/Task/Complete',
        data: 'projectId=' + items[0] + '&storyId=' + items[1] + '&id=' + items[2] + '&completed=' + completed,
        success: buildReplaceCallback(id)
    });
}

function RefreshStories() {
    $('tr.story-row').each(function () {
        var id = $(this).attr('id');
        var items = id.split('-');
        $.ajax({
            type: 'GET',
            url: '/Stories/Get',
            data: 'projectId=' + items[0] + '&storyId=' + items[1],
            success: buildReplaceCallback(id)
        });
    });
}

function StartStory(id) {
    var items = id.split('-');
    $.ajax({
        type: 'PUT',
        url: '/Stories/Start',
        data: 'projectId=' + items[0] + '&storyId=' + items[1],
        success: buildReplaceCallback(id)
    });
}

function FinishStory(id) {
    var items = id.split('-');
    $.ajax({
        type: 'PUT',
        url: '/Stories/Finish',
        data: 'projectId=' + items[0] + '&storyId=' + items[1],
        success: buildReplaceCallback(id)
    });
}

function AddComment(id) {
    var comment = prompt('Enter your comment:', 'I am too lazy to enter a real comment');
    if (comment) {
        var items = id.split('-');
        $.ajax({
            type: 'POST',
            url: '/Stories/AddComment',
            data: 'projectId=' + items[0] + '&storyId=' + items[1] + '&comment=' + comment,
            success: buildReplaceCallback(id)
        });
    }
}

function Toggle(elem, selector) {
    $(selector).each(function () {
        $(this).toggle(elem.checked);
    });
}