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

    $table = 'upload_error';
    //$pk = 'a.TRNREFNO';
    $arr = ['trnrefno','city','state','filename','upload_date','cityreason','statereason'];

    foreach ($arr as $value) {
        $field_arr[] = Field::inst($value);
    }

    Editor::inst($db, $table)
    ->fields($field_arr)
    //->leftjoin( 'hfccustdata b', 'b.TRNREFNO', '=', 'a.TRNREFNO' )
    //->leftjoin( 'coreusers c', 'a.upload_user', '=', 'c.userid' )
    //->where( function ( $q ) {
      //$q->where( 'a.status', "('N','E','P')", 'IN', false );
    //}
    //)
   //->distinct(true)
    ->process($_GET)
    ->json();

?>