/**
 * crossact - test
 * plugin for beginning comprehension test trials in cross-situational word learning study (crossact)
 * Martin Zettersten
 */

jsPsych.plugins['comprehension-test-prompt-2'] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image1', 'image');
  jsPsych.pluginAPI.registerPreload('comprehension-test-prompt', 'image2', 'image');

  plugin.trial = function(display_element, trial) {
	  
      // default values
	  trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
      trial.canvas_size = trial.canvas_size || [1024,700];
      trial.image_size = trial.image_size || [150, 150];
	  //trial.audio = trial.audio || "stims/bleep.wav";
	  trial.label = trial.label || "kita";
	  trial.question = trial.question || "Click on the START button to begin the trial.";
	  trial.timing_post_trial = typeof trial.timing_post_trial == 'undefined' ? 0 : trial.timing_post_trial;
	  
	  
	  
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
	  var text = paper.text(425, 50, trial.question);
	  //var labelText = paper.text(400, 225, trial.label);
	  text.attr({
		  "text-anchor": "middle",
		  editable: true,
		  "font-weight": "bold"
	  });
	  // labelText.attr({
	  // 		  "text-anchor": "middle",
	  // 		  editable: true,
	  // 		  "font-weight": "bold",
	  // 		  "font-size": "25px"
	  // });
	  //create audio
	  //var audio = new Audio(trial.audio);
	  
	  //display buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in button-response plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
	  console.log(buttons);
      display_element.append('<div id="jspsych-comp-test-prompt-btngroup" class="center-content block-center"></div>')
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        $('#jspsych-comp-test-prompt-btngroup').append(
          $(str).attr('id', 'jspsych-button-response-button-' + i).data('choice', i).addClass('jspsych-button-response-button').on('click', function(e) {
            var choice = $('#' + this.id).data('choice');
            after_response(choice);
          })
        );
      };

	  var rt = "NA";
	  
	  var start_time = (new Date()).getTime();
	    
	  var trial_data={};
	  
	  function after_response(choice) {
		  var end_time = (new Date()).getTime();
		  rt = end_time - start_time;
		  
		  $("#jspsych-button-response-stimulus").addClass('responded');
		  // disable all the buttons after a response
	      //$('.jspsych-button-response-button').off('click').attr('disabled', 'disabled');
		  $('.jspsych-button-response-button').attr('disabled', 'disabled');
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
			"rt": rt
		};
		
  		display_element.html('');
  		jsPsych.finishTrial(trial_data);
	};
  	
  };

return plugin;

})();