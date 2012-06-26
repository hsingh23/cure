/** A global singleton for the "server_communication.js" helper file that segregates the global fields utilized in this file to a contained variable. */
var SBSRV = 
{
	/** A hash table that contains all the assignments retrieved from the success book database.  This
		hash is used primarily in order to differentiate current assignments (those that have grades
		input into the database currently) and future assignments (those that don't have grades). */
	success_book_assignments: {},
	/** The Internet address of the success book database, which is used by this code in order to locate
		the assignment and grading information associated with a particular student. */
	// TODO: This field currently just points at the local host, which is the location of the database
	// during the development cycle.  This address should eventually be changed to point to the central
	// success book database and rerouted based on the class.
	success_book_address: 'http://localhost:8000/madness/'
};

/**
	A helper function that retrieves the netid of the user of the tudent visualization tool based on their authentication
	information.  This function is used by the server communication to determine the location from which to draw the grades
	in the database.

	@return The netid of the end user.
*/
function get_user_netid()
{
	// TODO: As the authentication component of the success book is still a work in progress, this code must be returned to and
	// revised in order to accurately retrieve the netid of the user currently logged in to the student visualization tool.
	return "sujim1";
};

/**
	A simple helper function that rounds the number input in the first parameter to the number of decimal
	placed defined in the second parameter.  This method is implemented primarily as to prevent grade
	string from being unnecessarily long.

	@param number A number to be rounded.
	@param decimal_places The number of decimal places to be rounded to (input zero to round to the nearest integer value).
	@return A new number that represents the number given in the function's first parameter rounded to the number of decimal
		places specified in the second parameter.
*/
function round_number(number, decimal_places)
{
	return (Math.round(number * Math.pow(10, decimal_places)) / Math.pow(10, decimal_places));
};

/**
	A simple helper function that, given JSON returned by the server after a request 
	from the student visualization tool, will log any errors raised by the server
	when processing the given JSON.

	@param returned_json A reference to the JSON string retrieved from the database by the AJAX request.

	@todo For now this error logging system simply uses Javascript's built-in "console.log"
	feature, but it may be better in the future to log these errors in a better location.
*/
function log_errors(returned_json)
{
	// If the returned JSON from the server contained one or more errors,
	// display these errors and attempt to parse as much data as possible
	// into the application.
	if(returned_json["status"] !== "success")
	{
		// These two lines simply format a string that can be output to a
		// useful location to inform both users and developers as to what
		// went wrong when the success book database was queried.
		var alert_string = "Exceptions raised in acquiring student data from the success book!  " + 
			"Exceptions:";
		for(var i = 0; i < returned_json["exceptions"].length; i+=1)
		{
			alert_string += "\n\t" + returned_json["exceptions"][i];
		}

		console.log(alert_string);
	}
};

/**
	A compliment to the "populate_assignments" function, this function places all the student grading information
	retrieved from the success book database into the locally stored assignment dictionaries so that it can be
	utilized by the student visualization tool.

	@todo Currently I on't have permissions to access the grade information of an arbitrary user, even with God access
	priveleges, so this method will not work correctly.  It must be fixed so that God users have the correct access.
*/
var populate_grades = function(returned_json)
{
	// Parses the JSON string sent by the server into a valid JSON object and placed back into the original container.
	returned_json = JSON.parse(returned_json);

	// Log any errors encountered by the server when it processed the given JSON.
	log_errors(returned_json);

	// Inserts the grade into the data entry associated with the assignment.  All assignments with entered grades
	// will have valid numbers recorded in their "score" field while future grades will have "NaN" stored.
	var grades = returned_json["rows"];
	for(var i = 0; i < grades.length; i+=1)
	{
		var curr_key = grades[i]["column_id"];
		SBSRV.success_book_assignments[curr_key]["score"] = 
			round_number((grades[i]["score"] / SBSRV.success_book_assignments[curr_key]["max"]) * 100, 2);
	}

	// For all the assignments that we've imported from the success book database, determine whether the assignment should
	// be considered a graded assignment (assignments with recoreded grades in the database) or a future assignment (those
	// without grades in the database).
	for(var assignment in SBSRV.success_book_assignments)
	{
		// This if statement ensures that we solely iterate over the column IDs stored in the "success_book_assignments"
		// hash and not those contained within its prototype.
		if(SBSRV.success_book_assignments.hasOwnProperty(assignment))
		{
			// If the assignment didn't have a score contained within the database, then it must be a future assignment.
			// In order to make the student visualization tool work, also mark this assignment's score down for the student
			// as 100% (as an optimistic prediction).
			if(SBSRV.success_book_assignments[assignment]["score"] === undefined)
			{
				SBSRV.success_book_assignments[assignment]["score"] = 100;
				SVIS.storage.futureGradeItems.push(SBSRV.success_book_assignments[assignment]);
			}
			// Otherwise, the score was in the database, so it should be considered a graded (or "current") assignment.
			else
			{
				SVIS.storage.gradeItems.push(SBSRV.success_book_assignments[assignment]);
			}
		}
	}
};

/**
	Retrieves all the assignments related to course students from the success book database.
*/
var populate_assignments = function(returned_json)
{
	// Parses the JSON string sent by the server into a valid JSON object and placed back into the original container.
	returned_json = JSON.parse(returned_json);

	// Log any errors encountered by the server when it processed the given JSON.
	log_errors(returned_json);

	// Retrieves the assignment names from the success book database and formats these names into local
	// data stores (specifically, the "gradeItems" and "futureGradeItems" fields).
	var assignments = returned_json["rows"];
	for(var i = 0; i < assignments.length; i+=1)
	{
		// TODO: Not all of this code if correct as the formatting for the tables has not yet been established.
		// Specifically, the score, size, average, weight, and tags field all must be changed when the format
		// of these fields is finalized.
		var current_assignment = { "name": assignments[i]["name"], "column_id": assignments[i]["column_id"], "color": "red", 
			"min": assignments[i]["min"], "max": assignments[i]["max"], "score": undefined, "size": assignments[i]["weight"], 
			"average": 75, "weight": assignments[i]["weight"], "tags": assignments[i]["tags"] };
		SBSRV.success_book_assignments[current_assignment["column_id"]] = current_assignment; 
	}

	// TODO: This is a hacky solution that forces the asynchronous AJAX call to be called sequentially, so it would be 
	// best if there was a solution that logically separated the "populate_assignments" function from the "populate_grades"
	// function.
	$.post(SBSRV.success_book_address,
		// Retrieves the cells containing the grade information associated with
		// the student currently using the student visualization tool.  The
		// authentication for this student is processed on the back-end (that is,
		// if a student is to input a different netid, they will be barred from
		// viewing that information).
		{ q: '{"function": "search","table": "Cell","query": { "netid": "' + get_user_netid() + '"}}'},
   		populate_grades);

	//$.getJSON('test_cell.json', populate_grades);
};

/**
	The function used by the front-end code to retrieve the data
	associated with a student on the back-end.

	@note This portion of the code makes extensive use of AJAX and
	the JQuery library.
*/
function request_grades()
{
	// TODO: There's possibly a syntax error in calling the "populate_assignments" function here.  If it still fails by the time an
	// actual call to the server is made, then the function should be assigned to a variable.
	$.post(SBSRV.success_book_address,
		// Retrieves all the assignment information for the course.
		// This information is used to determine how many grade bubbles will
		// be needed for the visualization and the identification values to
		// give to these bubbles.
		{ q: '{ "function": "search", "table": "Column", "query": {} }'},
   		populate_assignments);
   		//function(json){console.log(json);});

	//$.getJSON('test_column.json', populate_assignments);
};