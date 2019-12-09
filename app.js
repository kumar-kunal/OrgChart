$('#submit-file').on("click", function (e) {
	e.preventDefault();
	$('#files').parse({
		config: {
			delimiter: "auto",
			complete: displayHTMLTable,
		},
		before: function (file, inputElem) {
			//console.log("Parsing file...", file);
		},
		error: function (err, file) {
			//console.log("ERROR:", err, file);
		},
		complete: function () {
			//console.log("Done with all files");
		}
	});
});


function displayHTMLTable(results) {
	var data_csv = results.data;
	var data_csv2 = [];
	var col = data_csv[0].join(",").split(",").length;
	var index = 0;
	for (i = 1; i < data_csv.length - 1; i++) {
		var row = data_csv[i];
		var cells = row.join(",").split(",");
		for (j = col - 1; j > 0; j--) {
			var temp = []
			temp[0] = cells[j];
			temp[1] = cells[j - 1];
			data_csv2[index++] = temp
		}
	}
	console.log(data_csv2);

	google.charts.load('current', {
		packages: ["orgchart"]
	});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = new google.visualization.DataTable();
		var row = data_csv[0];
		var cells = row.join(",").split(",");
		for (i = col - 1; i > col - 3; i--) {
			data.addColumn('string', cells[i]);
			//console.log(cells[i]);
		}


		for (i = 0; i < data_csv2.length; i++) {
			var row = data_csv2[i];
			var cells = row.join(",").split(",");
			//console.log(cells);
			data.addRow(cells);
		}

		// Create the chart.
		var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
		// Draw the chart, setting the allowHtml option to true for the tooltips.
		chart.draw(data, {
			'allowHtml': true,
			'allowCollapse': true,
		});

		//event handling
		google.visualization.events.addListener(chart, 'select', selectHandler);
		function selectHandler(e) {

			chart.collapse([1, 2, 3, 4], true);
		}
	}

}

// create pdf

function print(quality = 1) {
	const filename = 'Enterprise.pdf';

	html2canvas(document.querySelector('#chart_div'),
		{ scale: quality }
	).then(canvas => {
		let pdf = new jsPDF('p', 'mm', 'a4');
		pdf.addImage(canvas.toDataURL('image/png'), 'JPEG', 0, 0, 211, 298);
		pdf.save(filename);
	});
}
