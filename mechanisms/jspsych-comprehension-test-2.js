/**
 * crossPC - test
 * plugin for comprehension test trials in cross-situational word learning study (production vs. comprehension, crossPC)
 * Martin Zettersten
 */

jsPsych.plugins['comprehension-test-2'] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image1', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image2', 'image');

  plugin.trial = function(display_element, trial) {
	  
      // default values
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [150, 150];
	  //trial.audio = trial.audio || "stims/bleep.wav";
	  trial.label = trial.label || "kita";
	  trial.question = trial.question || "Click on the ";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 500 : trial.timing_post_trial;
	  
	  
	  
      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
	  
	  display_element.append($("<svg id='jspsych-test-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>"));

      var paper = Snap("#jspsych-test-canvas");
	  
	  var circle1 = paper.circle(175, 325, 90);
	  circle1.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });
	  
	  var circle2 = paper.circle(675, 325, 90);
	  circle2.attr({
		  fill: "#FFD3D6",
		  stroke: "#000",
		  strokeWidth: 5
	  });

	  
	  var imageLocations = {
		  pos1: [100, 250],
		  pos2: [600, 250]
	  };
	  
	  var image1 = paper.image(trial.image1, imageLocations["pos1"][0], imageLocations["pos1"][1], trial.image_size[0],trial.image_size[1]);
	  var image2 = paper.image(trial.image2, imageLocations["pos2"][0], imageLocations["pos2"][1], trial.image_size[0],trial.image_size[1]);

	  
	  //add prompt text
	  //display_element.append(trial.question + trial.label + "?");
	  var text = paper.text(425, 50, trial.question + trial.label + ".");
	  var labelText = paper.text(425, 150, trial.label);
	  text.attr({
		  "text-anchor": "middle",
		  editable: true,
		  "font-weight": "bold"
	  });
	  labelText.attr({
		  "text-anchor": "middle",
		  editable: true,
		  "font-weight": "bold",
		  "font-size": "25px"
	  });
	  //create audio
	  //var audio = new Audio(trial.audio);
	  
	  var isRight = "NA";
	  var choice = "NA";
	  var choiceIm = "NA";
	  var choiceType = "NA";
	  var rt = "NA";
	  
	  var start_time = (new Date()).getTime();
	    
	  var trial_data={};
	  
	  image1.click(function() {
		  var end_time = (new Date()).getTime();
		  rt = end_time - start_time;
		  circle1.attr({
			  fill: "#00ccff"
		  });
		  choice = trial.image1;
		  choiceLocation = "pos1";
		  save_response(choice,choiceLocation,rt);
	  });
	  
	  image2.click(function() {
		  var end_time = (new Date()).getTime();
		  rt = end_time - start_time;
		  circle2.attr({
			  fill: "#00ccff"
		  });
		  choice = trial.image2;
		  choiceLocation = "pos2";
		  save_response(choice,choiceLocation,rt);
	  });
	  


	  
	  function save_response(choice,choiceLocation,rt) {
		  image1.unclick();
		  image2.unclick();
		  
			if (choice==trial.targetImage) {
				choiceType="target";
				isRight=1
			} else {
				choiceType="foil";
				isRight=0;
			}
			endTrial();
	  };

	  
      function endTrial() {
		//var audioFeedback = new Audio(trial.audioFeedback);
		//audioFeedback.play();
        var trial_data = {
			"label": trial.label,
			"image1": trial.image1,
			"image2": trial.image2,
			"targetLocation": trial.targetLocation,
			"targetImage": trial.targetImage,
			"choiceLocation": choiceLocation,
			"choiceType": choiceType,
			"choiceImage": choice,
			"isRight": isRight,
			"rt": rt
			
		};
		

		setTimeout(function(){
			display_element.html('');
			jsPsych.finishTrial(trial_data);
		},trial.timing_post_trial);
		
      };
  };	  
		
		return plugin;
})();