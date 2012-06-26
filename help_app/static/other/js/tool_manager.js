/**
	@file
	The global manager for the Success Book Visual Interface, which swaps out tools (each defined as a set of javascript dependencies
	within the database) when the user interacts with the buttons in the navigation bar on the page.
*/

/** A simple string variable that keeps track of the current tool running in the view of the success book page.  This variable
	begins as undefined to represent that no application tool is currently running in the success book HTML page. */
var current_tool = undefined;

/**
	Swaps out the tool currently being run in the success book view for the tool corresponding to the string given in the method
	parameters.  This function should be called whenever a tool item in the navigation bar is clicked.

	@param new_tool The string representation of the tool being passed into the function.  Once the resoruces for the old tool are 
		cleaned up, the new tool is stored in the "current_tool" global variable. 

	@note This function demonstrates the overarching setup that must be in place for each tool imported into the success book database:
	each function must contain both an "init()" and "uninit()" function (the first to initialize the javascript associated with the
	tool and the second the clean up its resources/graphical elements), which must be contained within a wrapper correspoding to the
	name of the tool.
*/
function change_tools(new_tool)
{
	// Formats the "new_tool" field so that it can be altered into a javascript field name.
	new_tool = new_tool.toLowerCase();
	new_tool = new_tool.replace(" ", "_");

	// Though it's generally poor style to wrap the entirety of a function's logic within an outlying conditional, the logic fits in this
	// case: we shouldn't change a tool from itself to itself (this logic prevents odd behavior from occurring when users double click
	// items instead of single clicking).
	// Note: This logic may be removed if it becomes desirable to reset an application by clicking on its button again.
	if(current_tool !== new_tool)
	{
		//	So long as there was a previous (or, more appropriately, "current") tool, we must clean up its resources here!
		if(current_tool !== undefined)
		{
			eval(current_tool + ".uninit();");
		}

		// After the previous tool has been cleaned up, initialize the new tool here!
		current_tool = new_tool;
		eval(current_tool + ".init();");
	}
};