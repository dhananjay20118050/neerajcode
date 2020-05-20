<?php

require_once '../import.php';

use
    DataTables\Editor,
    DataTables\Editor\Field,
    DataTables\Editor\Format,
    DataTables\Editor\Mjoin,
    DataTables\Editor\Options,
    DataTables\Editor\Upload,
    DataTables\Editor\Validate;

    $table = 'bot_aps_tracking a';
    $pk = 'a.TRNREFNO';
    $arr = ['b.APPLNO as appno','a.TRNREFNO as TRNREFNO','b.is_existing_cust_1 as is_existing_cust_1', 'b.cifid_1 as cifid_1','b.is_existing_cust_2 as is_existing_cust_2', 'b.cifid_2 as cifid_2','b.is_existing_cust_3 as is_existing_cust_3', 'b.cifid_3 as cifid_3','b.AccountNo as accountno','a.is_processed as processed ','a.start_time as start_time', 'a.end_time as end_time','a.upload_datetime as upload_datetime'];

    foreach ($arr as $value) {
    	$field_arr[] = Field::inst($value);
    }

    // if(isset($_GET['date'])){
    //     if($_GET['date'] != ""){
    //         $date = getWorkingOursByDate($_GET['date']);
    //     }else{
    //         $date = getWorkingOursByDate(date("Y-m-d"));
    //     }
    // }else{
    //     $date = getWorkingOursByDate(date("Y-m-d"));
    // }

    Editor::inst($db, $table, array($pk))
    ->fields($field_arr)
    ->leftJoin( 'hfccustdata b', 'b.TRNREFNO', '=', 'a.TRNREFNO' )
    ->where( function ( $q ) {
      $q->where( 'b.cifid_1', null, '!=');
      $q->or_where( 'b.cifid_2',null, '!=');
      $q->or_where( 'b.cifid_3',null, '!=');
    })
    ->distinct(true)
    ->process($_GET)
    ->json();

?>