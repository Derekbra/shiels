var makeAShape = window.makeAShape || {};

/////////////////////////////////////////////////////////////////////
// Initialization

makeAShape.dateCreator = function(el)
{
	this.el = $(el);
	this.populateFields();
};

/////////////////////////////////////////////////////////////////////
// Implementation

makeAShape.dateCreator.prototype.populateFields = function()
{
	this.populate(".days",0,31);
	this.populate(".months",0,12);
	this.populateYears(new Date().getFullYear());
};

makeAShape.dateCreator.prototype.populate = function(selector,start,end)
{
	var fields = $(selector,$(this.el));

	for(var i=0;i<fields.length;i++)
	{
		// insert nothing at start
		var opt = new Option("--","--");
		fields[i].options[0]=opt;

		for(var j=start;j<end;j++)
		{
			var opt = new Option(j+1, j+1);
			fields[i].options[j+1]=opt;
		}
	}

	$(selector).append("<span class='sp-dd'>▼</span>")
};

makeAShape.dateCreator.prototype.populateYears = function(today)
{
	var fields = $(".years",$(this.el));
	var thisyear=today;

	for(var i=0;i<fields.length;i++)
	{
		// insert nothing at start
		var opt = new Option("----","----");
		fields[i].options[0]=opt;

		for (var y=0; y<120; y++)
		{
			var opt = new Option(thisyear, thisyear);
			fields[i].options[y+1]=opt;
			thisyear--;
		}

		thisyear=today;
	}
};

/////////////////////////////////////////////////////////////////////
// To string methods

makeAShape.dateCreator.prototype.getDates = function()
{
	var res={};
	var nameStamp = "dateSet";
	var counter = 0;
	var dateContainers = $(".date-set",$(this.el));

	for(var i=0;i<dateContainers.length;i++)
	{
		var dates = this.createDateArray(dateContainers[i]);

		if(dates==null)
			continue;

		res[nameStamp+counter]={};
		res[nameStamp+counter].points=dates;
		counter++;
	}

	return res;
};

makeAShape.dateCreator.prototype.createDateArray = function(el)
{
	var res = [];

	var day = String($(".days",el).val());
	var month = String($(".months",el).val());
	var year = String($(".years",el).val());

	if(day=="--"||month=="--"||year=="----")
		return null;

	if(day.length==1)
		day="0"+day;

	if(month.length==1)
		month="0"+month;

	res.push(day);
	res.push(month);
	res.push(year.substr(0,2));
	res.push(year.substr(2,2));

	return res;
};