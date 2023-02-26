<?php
if ((isset($_GET['hover-id'])) and (isset($_GET['hover-group']))) {
  $id =  $_GET['hover-id'];
  $group =  $_GET['hover-group'];
} else {
  $id = '';
  $group = '';
}


// Read the JSON file 
$json = file_get_contents('data.json');

// Decode the JSON file
// $json_data = json_decode($json, true);
$jsonObj = json_decode($json);

$IdText = $id;
$objValues = $jsonObj->$IdText;


$GroupText = "group";
$DescriptionText = "description";
$ImageText = "image";


$currentGroup = $objValues->$GroupText;
$currentDescription = $objValues->$DescriptionText;
$currentImage = $objValues->$ImageText;


// Display data
// echo "<pre>";
// print_r($currentGroup);
// echo "</pre>";



?>



<?php
if ($group == 'left-img-style') { ?>

  <!-- inner content start -->
  <div class="popover-arrow__arrow"></div>
  <div class="hover__card-inner">
    <div class="card-picture-container">
      <img src="assets/img/<?php echo $currentImage; ?>" alt="<?php echo $currentImage; ?>" />
    </div>

    <div class="card-text-container">
      <p><?php echo $currentDescription; ?></p>
    </div>
  </div>
  <!-- inner content end -->

<?php } elseif ($group == 'right-img-style') { ?>

  <!-- inner content start -->
  <div class="popover-arrow__arrow"></div>
  <div class="hover__card-inner">
    <div class="card-text-container">
      <p><?php echo $currentDescription; ?></p>
    </div>

    <div class="card-picture-container">
      <img src="assets/img/<?php echo $currentImage; ?>" alt="<?php echo $currentImage; ?>" />
    </div>
  </div>
  <!-- inner content end -->

<?php } elseif ($group == 'top-img-style') { ?>

  <!-- inner content start -->
  <div class="popover-arrow__arrow"></div>
  <div class="hover__card-inner top-to-top">
    <div class="card-picture-container">
      <img src="assets/img/Heroin_paraphernalia.jpg" alt="rdj" />
    </div>

    <div class="card-text-container">
      <p><?php echo $currentDescription; ?></p>
    </div>
  </div>
  <!-- inner content end -->

<?php } elseif ($group == 'no-img-style') { ?>

  <!-- inner content start -->
  <div class="popover-arrow__arrow"></div>
  <div class="hover__card-inner top-to-top">
    <div class="card-text-container">
      <p><?php echo $currentDescription; ?></p>
    </div>
  </div>
  <!-- inner content end -->

<?php } ?>