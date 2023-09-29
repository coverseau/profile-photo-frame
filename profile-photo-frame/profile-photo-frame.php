<?php
/**
  * Profile photo frame
  *
  * @package           profile-photo-frame
  * @author            Rado Faletič
  * @copyright         2022, 2023 Rado Faletič
  * @license           GPL-2.0-or-later
  *
  * @wordpress-plugin
  * Plugin Name:       Profile photo frame
  * Description:       Enables you to display a widget on your WordPress website so users can add a profile photo frame to their profile photo.
  * Version:           1.0.5
  * Requires at least: 6.0
  * Requires PHP:      7.0
  * Author:            Rado Faletič
  * Author URI:        https://RadoFaletic.com
  * Text Domain:       profile-photo-frame
  * License:           GPL v2 or later
  * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
  * Update URI:        https://RadoFaletic.com/plugins/info.json
  */

/*
  {Plugin Name} is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or any later version.
  
  {Plugin Name} is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License along with {Plugin Name}. If not, see {URI to Plugin License}.
  */

if (!function_exists('RadoFaletic_com_check_for_updates')) {
  function profile_photo_frame_check_for_updates($update, $plugin_data, $plugin_file) {
    static $response = false;
    if (empty($plugin_data['UpdateURI']) || !empty($update)) {
      return $update;
    }
    if ($response === false) {
      $response = wp_remote_get($plugin_data['UpdateURI']);
    }
    if (empty($response['body'])) {
      return $update;
    }
    $custom_plugins_data = json_decode($response['body'], true);
    if (!empty($custom_plugins_data[$plugin_file])) {
      return $custom_plugins_data[$plugin_file];
    } else {
      return $update;
    }
  }
  add_filter('update_plugins_RadoFaletic.com', 'RadoFaletic_com_check_for_updates', 10, 3);
}

function ppf_profile_photo_frame() {
  wp_enqueue_style('ppf-profile-photo-frame-style', plugins_url('/css/profile-photo-frame.css', __FILE__), null, false);
  wp_enqueue_script('ppf-profile-photo-frame-script', plugins_url('/js/profile-photo-frame.js', __FILE__), null, false);
  wp_localize_script('ppf-profile-photo-frame-script', 'ppfProfilePhotoFrameScript', array('pluginDirUrl' => plugin_dir_url(__FILE__)));
  
  $content = '<p>Use this page to create a frame for your social media photo in three simple steps.</p>';
  $content .= '<div id="ppf_SectionBlocks_templates" class="ppf_SectionBlocks"><section>';
  $content .= '<h2 id="ppf_templateList_heading">Step 1: select a template</h2>';
  $content .= '<div id="ppf_templateList"></div>';
  $content .= '</section></div>';
  $content .= '<div class="ppf_SectionBlocks"><section>';
  $content .= '<h2>Step 2: upload photo</h2>';
  $content .= '<p><input type="file" id="ppf_selectOriginalPhoto" accept="image/*"><button id="ppf_selectPhoto" type="button">select photo</button></p>';
  $content .= '<div>';
  $content .= '<div id="ppf_originalPhotoDisplay_block"><canvas id="ppf_originalPhotoDisplay" width="200" height="200" data-photo="">Your browser does not support the features of this website.</canvas></div>';
  $content .= '<form id="ppf_originalPhotoCropForm">';
  $content .= '<h3>Crop</h3>';
  $content .= '<p style="text-align: left;"><label for="ppf_originalPhotoCropSize">height &amp; width (%)</label>: (<span id="ppf_originalPhotoCropSizeDisplay">100</span>%)<br> <input id="ppf_originalPhotoCropSize" name="ppf_originalPhotoCropSize" type="range" min="0.01" max="1" value="1" step="0.01" list="ppf_originalPhotoCropValues"></p>';
  $content .= '<p style="text-align: left;"><label for="ppf_originalPhotoCropOffsetX">horizontal offset (%)</label>: (<span id="ppf_originalPhotoCropOffsetXDisplay">0</span>%)<br> <input id="ppf_originalPhotoCropOffsetX" name="ppf_originalPhotoCropOffsetX" type="range" min="0" max="0.99" value="0" step="0.01" list="ppf_originalPhotoCropValues"></p>';
  $content .= '<p style="text-align: left;"><label for="ppf_originalPhotoCropOffsetY">vertical offset (%)</label>: (<span id="ppf_originalPhotoCropOffsetYDisplay">0</span>%)<br> <input id="ppf_originalPhotoCropOffsetY" name="ppf_originalPhotoCropOffsetY" type="range" min="0" max="0.99" value="0" step="0.01" list="ppf_originalPhotoCropValues"></p>';
  $content .= '<datalist id="ppf_originalPhotoCropValues"><option value="0" label="0%"></option><option value="0.25" label="25%"></option><option value="0.5" label="50%"></option><option value="0.75" label="75%"></option><option value="1" label="100%"></option></datalist>';
  $content .= '</form>';
  $content .= '</div></section>';
  $content .= '<section>';
  $content .= '<h2>Step 3: view and download your new profile photo</h2>';
  $content .= '<p><input id="ppf_showCircle" name="ppf_showCircle" type="checkbox" value="yes" checked><label for="ppf_showCircle"> show me how this will look on my social media profile</label></p>';
  $content .= '<p><button id="ppf_downloadPhoto" type="button">download photo below</button></p>';
  $content .= '<canvas id="ppf_newPhotoDisplay" width="300" height="300">Your browser does not support the features of this website.</canvas>';
  $content .= '</section></div>';
  $content .= '<canvas id="ppf_newPhotoDownload" width="800" height="800">Your browser does not support the features of this website.</canvas>';
  return $content;
}
add_shortcode('ppf-profile-photo-frame', 'ppf_profile_photo_frame');
