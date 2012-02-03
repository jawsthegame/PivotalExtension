function SignUpForTask() {
    initials = prompt('Enter your initials in AA/BB format (an empty string will clear existing assignment):', '');
    $('div.ui-selected').each(function () {
        if (initials != null) {
            var id = $(this).attr('id');
            var items = id.split('-');
            $.ajax({
                type: 'POST',
                url: '/Task/SignUp',
                data: 'projectId=' + items[0] + '&storyId=' + items[1] + '&id=' + items[2] + '&initials=' + initials,
                success: function (html) {
                    $('#' + id).replaceWith(html);
                }
            });
        }
    });
}

function RemoveTask(id) {
    var items = id.split('-');
    $.ajax({
        type: 'POST',
        url: '/Stories/DeleteTask',
        data: 'projectId=' + items[0] + '&storyId=' + items[1] + '&taskId=' + items[2],
       success: function (html) {
           var $toRefresh = $('#' + items[0] + '-' + items[1]);
           $toRefresh.unbind()
            .replaceWith(html);
            BindFaceboxLinks($toRefresh);
        }
    });
}

function CompleteTask(id, completed) {
    var items = id.split('-');
    $.ajax({
        type: 'POST',
        url: '/Task/Complete',
        data: 'projectId=' + items[0] + '&storyId=' + items[1] + '&id=' + items[2] + '&completed=' + completed,
        success: function (html) {
            $('#' + id).replaceWith(html);
        }
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
            success: function (html) {
                $('#' + id).replaceWith(html);
            }
        });
    });
}

function StartStory(id) {
    var items = id.split('-');
    $.ajax({
        type: 'POST',
        url: '/Stories/Start',
        data: 'projectId=' + items[0] + '&storyId=' + items[1],
        success: function (html) {
            $('#' + id).replaceWith(html);
        }
    });
}

function FinishStory(id) {
    var items = id.split('-');
    $.ajax({
        type: 'POST',
        url: '/Stories/Finish',
        data: 'projectId=' + items[0] + '&storyId=' + items[1],
        success: function (html) {
            $('#' + id).replaceWith(html);
        }
    });
}

function Toggle(elem, selector) {
    $(selector).each(function () {
        var showCompleted = !elem.checked //this should eventually be checked = show
        $(this).toggle(showCompleted);
    });
}


function BindFaceboxLinks($toBox) {
    //facebox stuff
    //requires jquery.form.js and facebox
    var $updateTarget;

    $toBox = $toBox || $('body');
    $toBox
        .find('a.facebox')
        .click(function () {
            $updateTarget = $('#' + this.rel);
        })
        .facebox();

    //on reveal, need to bind new async forms and cancellation links
    $(document).bind('reveal.facebox', function (a, b) {
        $('.async-form')
            .ajaxForm(function (responseText) {
                $updateTarget
                    .unbind()
                    .replaceWith(responseText);
                $.facebox.close();
                BindFaceboxLinks($updateTarget);
                $updateTarget = null;
            })
        .find('.facebox-save').bind('click', function () {
            $(this).parent().submit();
            return false;
        })
        .end()
        .find('.facebox-cancel').bind('click', function () {
            $.facebox.close();
            $updateTarget = null;
            return false;
        });
    });
}