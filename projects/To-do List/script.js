var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

$(document).ready(function () {

    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
			todoOwner: "task-owner",
            todoDate: "task-date",
			todoDatePassed: "task-date-passed",
            todoDescription: "task-description",
            taskId: "task-",
			taskContainer: "task-container",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = {
            "1" : "#pending",
            "2" : "#inProgress",
            "3" : "#completed"
        };
	
	var opened = [];

    // Add Task
    var generateElement = function(params){
        var parent = $(codes[params.code] + ">." + defaults.taskContainer),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class" : defaults.todoTask,
            "id" : defaults.taskId + params.id.toString(),
            "data" : params.id.toString()
        }).appendTo(parent);

        $("<div />", {
            "class" : defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);
		
        $("<div />", {
            "class" : ((tryParseDate(params.date)>=new Date())?defaults.todoDate:defaults.todoDatePassed),
            "text": params.date
        }).appendTo(wrapper);
		
		console.log(tryParseDate(params.date));
		console.log(new Date());

        $("<div />", {
            "class" : defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);

		$("<div />", {
            "class" : defaults.todoOwner,
            "text": params.owner
        }).appendTo(wrapper);
		
	    wrapper.draggable({
            start: function() {
				//put to Top
				var tasks = $("div." + defaults.todoTask),
					max = 0;
					
				tasks.each(function() {
					var z = parseInt($(this).css("z-index"),10);
					z = isNaN(z)?10:z;
					max = Math.max(max,z);
				});
				
				$(this).css("z-index", max+1);
				
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
            },
	        revert: "invalid",
	        revertDuration : 200
        });

    };

    // Remove task
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, owner, tempData;

        if (inputs.length !== 6) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
		owner=inputs[3].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title,
			owner: owner,
            date: date,
			description: description,
            // description: description.replace("\n","<br />"),
        };

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element
        generateElement(tempData);

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
		inputs[3].value = "";
    };
	
	var tryParseDate = function (input) {
		// Format is DD/MM/YYYY
		var parts = input.split("/");
		if (!(parts.length == 3)) {
			return;
		}
		else {
			return new Date(parts[2], parts[1]-1, parts[0], 23, 59, 59, 999);
		}
	}

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Message",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);
		
		if (!responseDialog.hasClass("ui-dialog-content")) {
			
			//Initialize the dialog			
			buttonOptions = [{
				text: "OK",			
				click : function () {
					responseDialog.dialog("close");
				}
			}];

			responseDialog.dialog({
				autoOpen: true,
				width: 400,
				modal: true,
				closeOnEscape: true,
				buttons: buttonOptions
			});
		}
		else {
			
			//If exists then open
			responseDialog.dialog("open");
		}

    };

    todo.clear = function () {
        data = {};
        localStorage.setItem("todoData", JSON.stringify(data));
        $("." + defaults.todoTask).remove();
    };

	//Init
    (function () {

        $.each(data, function (index, params) {
            generateElement(params);
        });

        // Adding drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(defaults.taskId, ""),
                            object = data[id];

                            // Removing old element
                            removeElement(object);

                            // Changing object code
                            object.code = index;

                            // Generating new element
                            generateElement(object);

                            // Updating Local Storage
                            data[id] = object;
                            localStorage.setItem("todoData", JSON.stringify(data));

                            // Hiding Delete Area
                            $("#" + defaults.deleteDiv).hide();
					},	
				over: function(event, ui) {
						// Open accordion
						opened[index] = $(this).accordion("option", "active");
						$(this).accordion("option", "active", 0);
					},
				out: function(event, ui) {
						// Close accordion if not previously opened
						$(this).accordion("option", "active", opened[index]);
					},
            });
        });

        // Adding drop function to delete div
        $("#" + defaults.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(defaults.taskId, ""),
                    object = data[id];

                // Removing old element
                removeElement(object);

                // Updating local storage
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));

                // Hiding Delete Area
                $("#" + defaults.deleteDiv).hide();
            }
        })

    })();
});