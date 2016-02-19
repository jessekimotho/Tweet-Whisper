var showSideMenu=true;
function toggeleSideMenu(){
    var element =document.querySelectorAll('.fixed-side-nav-bar .icon ');
    if (showSideMenu){
        for(var i=1;i<element.length;i++){
            element[i].style.display="none";
        }
        showSideMenu=false;
    }else{

        for(var i=1;i<element.length;i++){
            element[i].style.display="block";
        }        
        showSideMenu=true;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function wp_action(data, svg_area, silent) {
    var silent = silent || false;
    if (!silent) {
        total_edits += 1;
    }
    var now = new Date();
    edit_times.push(now);
    to_save = [];
    if (edit_times.length > 1) {
        for (var i = 0; i < edit_times.length + 1; i ++) {
            var i_time = edit_times[i];
            if (i_time) {
                var i_time_diff = now.getTime() - i_time.getTime();
                if (i_time_diff < 60000) {
                    to_save.push(edit_times[i]);
                }
            }
        }
        edit_times = to_save;
        var opacity = 1 / (100 / to_save.length);
        if (opacity > 0.5) {
            opacity = 0.5;
        }
        update_epm(to_save.length, svg_area);
    }
    
    //var size = Math.random() * (500-0)+0;
    var size=data.body.length *2;
    var label_text = data.body;
    var csize = size;
    var no_label = false;
    var type;
/*    if (data.is_anon) {
        type = 'anon';
    } else if (data.is_bot) {
        type = 'bot';
    } else {
        type = 'user';
    }
*/
    type="bot"
    
    var circle_id = 'd' + ((Math.random() * 100000) | 0);
    var abs_size = Math.abs(size);
    size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);

//    Math.seedrandom(data.page_title)
    var x = Math.random() * (width);
    var y = Math.random() * (height);
    console.log(x,y,"width:",width,"height:",height);
    if (!silent) {
        if (csize > 0) {
            play_sound(size, 'add', 1);
        } else {
            play_sound(size, 'sub', 1);
        }
    }
    
    if (silent) {
        var starting_opacity = 0.2;
    } else {
        var starting_opacity = 1;
    }
    
    var fill_color;    
    if (data.mood_color !=undefined && data.mood_color !=null && data.mood_color !=""){
            fill_color=data.mood_color;
    }else{
        console.log('choosing random color');
        fill_color=getRandomColor();
    }
    
    var circle_group = svg_area.append('g')
        .attr('transform', 'translate(' + x + ', ' + y + ')')
       // .attr('fill', edit_color)
        .attr('fill', fill_color)
        .style('opacity', starting_opacity)

    var ring = circle_group.append('circle')
         .attr({r: size + 20,
                stroke: 'none'})
         .transition()
         .attr('r', size + 40)
         .style('opacity', 0)
         .ease(Math.sqrt)
         .duration(2500)
         .remove();

    var circle_container = circle_group.append('a')
//        .attr('xlink:href', data.url)
        .attr('xlink:href', data.avatar_page_url)
        .attr('target', '_blank')
        .attr('fill', svg_text_color);

    var circle = circle_container.append('circle')
//        .classed(type, true)
            .attr('fill', fill_color)
            .attr('r', size)
            .transition()
            .duration(max_life)
            .style('opacity', 0)
            .each('end', function() {
                circle_group.remove();
           })
          .remove();

    circle_container.on('mouseover', function() {
        if (no_label) {
            no_label = false;
            circle_container.append('text')
                .text(label_text)
                .classed('article-label type', true)
                .attr('text-anchor', 'middle')
                .transition()
                .delay(1000)
                .style('opacity', 0)
                .duration(2000)
                .each('end', function() { no_label = true; })
                .remove();
        }

    });

      if(true){
        var text = circle_container.append('text')
            .text(label_text)
            .classed('article-label type', true)
            .attr('text-anchor', 'middle')
            .transition()
            .delay(1000)
            .style('opacity', 0)
            .duration(2000)
            .each('end', function() { no_label = true; })
            .remove();
         d3plus.textwrap()
            .container(text)
            .align('center')
            .draw();
    } else {
        no_label = true;
    }
}

function play_sound(size, type, volume) {
    var max_pitch = 100.0;
    var log_used = 1.0715307808111486871978099;
    var pitch = 100 - Math.min(max_pitch, Math.log(size + log_used) / Math.log(log_used));
    var index = Math.floor(pitch / 100.0 * Object.keys(celesta).length);
    var fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(Object.keys(celesta).length - 1, index);
    index = Math.max(1, index);
    if (current_notes < note_overlap) {
        current_notes++;
        if (type == 'add') {
            celesta[index].play();
        } else {
            clav[index].play();
        }
        setTimeout(function() {
            current_notes--;
        }, note_timeout);
    }
}

function play_random_swell() {
    var index = Math.round(Math.random() * (swells.length - 1));
    try{
        swells[index].play();        
    }catch(err){
        console.log(err);
    }

}

function newuser_action(data, lid, svg_area) {
}

var enable = function(setting) {
    var hash_settings = return_hash_settings();
    if (setting && hash_settings.indexOf(setting) < 0) {
        hash_settings.push(setting);
    }
    set_hash_settings(hash_settings);
};

var disable = function(setting) {
    var hash_settings = return_hash_settings();
    var setting_i = hash_settings.indexOf(setting);
    if (setting_i >= 0) {
        hash_settings.splice(setting_i, 1);
    }
    set_hash_settings(hash_settings);
};



var epm_text = false;
var epm_container = {};

function update_epm(epm, svg_area) {
    if (!epm_text) {
        epm_container = svg_area.append('g')
            .attr('transform', 'translate(0, ' + (height - 25) + ')');

        var epm_box = epm_container.append('rect')
            .attr('fill', newuser_box_color)
            .attr('opacity', 0.5)
            .attr('width', 135)
            .attr('height', 25);

        epm_text = epm_container.append('text')
            .classed('newuser-label', true)
            .attr('transform', 'translate(5, 18)')
            .style('font-size', '.8em')
            .text(epm + ' tweets per minute');

    } else if (epm_text.text) {
        epm_text.text(epm + ' tweets per minute');
    }
}
