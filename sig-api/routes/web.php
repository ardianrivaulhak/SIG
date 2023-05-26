<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

// $router->get('/', function () use ($router) {
//     return $router->app->version();
// });
Route::get('/clear-cache', function () {
    Cache::flush();
    Cache::clear();
    return 'DONE'; //Return anything
});
Route::get('url-active', 'AuthController@urlactive');
Route::get('send_email', 'Analysis\KontrakujiController@mail');
Route::get('/', 'Analysis\CustomershandleController@testing');
Route::get('tracking-contract', 'Analysis\KontrakujiController@trackingContract');
Route::get('employee-details', 'AuthController@getDataEmployee');
Route::get('manual/n/{idlhu}', 'Document\ManualCertController@manual');
Route::get('manual/o/{idlhu}', 'Document\ManualCertController@manualmd');

//attachment kendali//
Route::get('kendali/sample/{id_sample}/pdf', ['as' => 'kendali.sample.pdf', 'uses' => 'Analysis\KendaliController@attachment']);
Route::post('api/analystpro/certificate/sample/lhu/{id_sample}', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@detailLHU']);
Route::get('api/analystpro/invoice/detail/{id}', 'Analysis\FinanceController@detailInvoice');
$router->post('api/analystpro/product/contract/mediartu/get-products', ['uses' => 'Products\Mediartu\MediartuController@getProductinContract']);

$router->post(
    'auth/login',
    [
        'uses' => 'AuthController@authenticate'
    ]
);
Route::get('/view-kontrak/{id}', 'Printout\KontrakController@pdf');
Route::get('/kendali/sample/parameter/contract/{id}', ['as' => 'kendali.sample.parameterInSample', 'uses' => 'Analysis\KendaliController@showParameterInContract']);

$router->group(
    ['middleware' => 'jwt.auth'],
    function () use ($router) {



        $router->get('me', 'AuthController@me');
        $router->get('checkpassword', 'AuthController@checkpassword');
        $router->get('setpassword', 'AuthController@setpassword');
        $router->get('menuget', 'MenuController@index');
        $router->group(['prefix' => 'api'], function () use ($router) {
            $router->get('accepteduser', 'AuthController@approvedContract');
            $router->post('change-password', 'AuthController@change_password');

            //invoice Keuangan
            Route::get('/view-invoice', 'Printout\InvoiceController@testing');
            Route::get('/berita-acara', 'Printout\BeritaAcaraController@testing');
            Route::get('/kwitansi', 'Printout\KwitansiController@testing');
            Route::get('/tanda-terima', 'Printout\TandaTerimaController@testing');
            //invoice Keuangan

            $router->post('activity-add', 'ActivityController@saveActivity');
            $router->put('activity-edit/{id}', 'ActivityController@editActivity');

            $router->group(['prefix' => 'master'], function () use ($router) {


                //voucher

                $router->get('voucher', 'Master\VoucherController@index');
                $router->get('voucher/{id}', 'Master\VoucherController@show');
                $router->post('voucher/add', ['uses' => 'Master\VoucherController@store']);
                $router->patch('voucher/{id}', ['uses' => 'Master\VoucherController@update']);
                $router->get('voucher-set-status', ['uses' => 'Master\VoucherController@setstatus']);
                $router->delete('voucher/{id}', ['uses' => 'Master\VoucherController@destroy']);

                //end voucher

                $router->get('info-cust', 'Analysis\CustomerController@info_keu_cust');
                $router->post('info-customer-add', 'Analysis\CustomerController@add_info_keu_cust');
                $router->post('send-npwp-cust', 'Analysis\CustomerController@npwpadd');
                $router->delete('npwp-cust-delete/{id}', 'Analysis\CustomerController@npwpdelete');
                $router->get('menu-master', 'MenuController@getdata');
                $router->get('menu-register', 'MenuController@menuregister');
                $router->post('menu-add', 'MenuController@menuadd');
                $router->put('menu-update/{id}', 'MenuController@menupdate');
                $router->delete('menu-delete/{id}', 'MenuController@deleteMenu');
                $router->get('user', 'MenuController@userget');
                // $router->get('specific-package',['as'=>'specific','uses'=>'Master\SpecificPackageController@index']);
                $router->get('sub-specific-package', ['as' => 'specific', 'uses' => 'Master\SpecificPackageController@getSubSpecific']);
                $router->get('city', ['as' => 'city', 'uses' => 'Master\CityController@index']);
                $router->get('city/{id}', ['as' => 'city.view', 'uses' => 'Master\CityController@show']);
                $router->delete('city/{id}', ['as' => 'city.delete', 'uses' => 'Master\CityController@destroy']);

                $router->get('lab', ['as' => 'lab', 'uses' => 'Master\LabController@index']);
                $router->get('lab/{id}', ['as' => 'lab.view', 'uses' => 'Master\LabController@show']);
                $router->post('lab/add', ['uses' => 'Master\LabController@store']);
                $router->put('lab/{id}', ['as' => 'lab.update', 'uses' => 'Master\LabController@update']);
                $router->delete('lab/{id}', ['as' => 'lab.delete', 'uses' => 'Master\LabController@destroy']);


                $router->get('paketparameter', ['as' => 'paketparameter', 'uses' => 'Master\PaketParameterController@index']);
                $router->get('setspecialprice', 'Master\PaketParameterController@setSpecialPrice');
                $router->get('paketparameter-contract', ['as' => 'paketparameter', 'uses' => 'Master\PaketParameterController@indexContract']);
                $router->get('paketparameter/{id}', ['as' => 'paketparameter', 'uses' => 'Master\PaketParameterController@show']);
                $router->put('paketparameter/{id}', ['as' => 'paketparameter.update', 'uses' => 'Master\PaketParameterController@update']);
                $router->delete('paketparameter/{id}', ['as' => 'paketparameter.delete', 'uses' => 'Master\PaketParameterController@destroy']);
                $router->post('paketparameter/add', ['uses' => 'Master\PaketParameterController@store']);
                $router->get('accept-paketparameter', ['uses' => 'Master\PaketParameterController@acceptpackage']);


                $router->get('specific-package', 'Master\SpecificPackageController@index');
                $router->get('specific-package-contract', 'Master\SpecificPackageController@indexContract');
                $router->get('specific-package/{id}', 'Master\SpecificPackageController@show');
                $router->post('subspecific-package', 'Master\SpecificPackageController@find_based_subid');
                $router->put('specific-package/{id}', 'Master\SpecificPackageController@update');
                $router->delete('specific-package/{id}', 'Master\SpecificPackageController@destroy');
                $router->post('specific-package/add', 'Master\SpecificPackageController@store');
                $router->get('accept-specific-package', 'Master\SpecificPackageController@accept');


                $router->get('bagian', ['as' => 'bagian', 'uses' => 'Master\BagianController@index']);
                $router->get('bagian/{id}', ['as' => 'bagian.view', 'uses' => 'Master\BagianController@show']);
                $router->post('bagian/add', ['uses' => 'Master\BagianController@store']);
                $router->put('bagian/{id}', ['as' => 'bagian.update', 'uses' => 'Master\BagianController@update']);
                $router->delete('bagian/{id}', ['as' => 'bagian.delete', 'uses' => 'Master\BagianController@destroy']);

                $router->get('subagian', ['as' => 'subagian', 'uses' => 'Master\SubagianController@index']);
                $router->get('subagian/{id}', ['as' => 'subagian.view', 'uses' => 'Master\SubagianController@show']);
                $router->post('subagian/add', ['uses' => 'Master\SubagianController@store']);
                $router->put('subagian/{id}', ['as' => 'subagian.update', 'uses' => 'Master\SubagianController@update']);
                $router->delete('subagian/{id}', ['as' => 'subagian.delete', 'uses' => 'Master\SubagianController@destroy']);

                $router->get('catalogue', ['as' => 'catalogue', 'uses' => 'Master\CatalogueController@index']);
                $router->get('catalogue/{id}', ['as' => 'catalogue.view', 'uses' => 'Master\CatalogueController@show']);
                $router->post('catalogue/add', ['uses' => 'Master\CatalogueController@store']);
                $router->put('catalogue/{id}', ['as' => 'catalogue.update', 'uses' => 'Master\CatalogueController@update']);
                $router->delete('catalogue/{id}', ['as' => 'catalogue.delete', 'uses' => 'Master\CatalogueController@destroy']);

                $router->get('subcatalogue', ['as' => 'subcatalogue', 'uses' => 'Master\SubcatalogueController@index']);
                $router->get('subcatalogue/{id}', ['as' => 'subcatalogue.view', 'uses' => 'Master\SubcatalogueController@show']);
                $router->post('subcatalogue/add', ['uses' => 'Master\SubcatalogueController@store']);
                $router->put('subcatalogue/{id}', ['as' => 'subcatalogue.update', 'uses' => 'Master\SubcatalogueController@update']);
                $router->delete('subcatalogue/{id}', ['as' => 'subcatalogue.delete', 'uses' => 'Master\SubcatalogueController@destroy']);

                $router->get('standart', ['as' => 'standart', 'uses' => 'Master\StandartController@index']);
                $router->get('standart/{id}', ['as' => 'standart.view', 'uses' => 'Master\StandartController@show']);
                $router->post('standart/add', ['uses' => 'Master\StandartController@store']);
                $router->put('standart/{id}', ['as' => 'standart.update', 'uses' => 'Master\StandartController@update']);
                $router->delete('standart/{id}', ['as' => 'standart.delete', 'uses' => 'Master\StandartController@destroy']);

                $router->get('statuspengujian', ['as' => 'statuspengujian', 'uses' => 'Master\StatuspengujianController@index']);
                $router->get('statuspengujian/{id}', ['as' => 'statuspengujian.view', 'uses' => 'Master\StatuspengujianController@show']);
                $router->post('statuspengujian/add', ['uses' => 'Master\StatuspengujianController@store']);
                $router->put('statuspengujian/{id}', ['as' => 'statuspengujian.update', 'uses' => 'Master\StatuspengujianController@update']);
                $router->delete('statuspengujian/{id}', ['as' => 'statuspengujian.delete', 'uses' => 'Master\StatuspengujianController@destroy']);

                $router->get('tujuanpengujian', ['as' => 'tujuanpengujian', 'uses' => 'Master\TujuanpengujianController@index']);
                $router->get('tujuanpengujian/{id}', ['as' => 'tujuanpengujian.view', 'uses' => 'Master\TujuanpengujianController@show']);
                $router->post('tujuanpengujian/add', ['uses' => 'Master\TujuanpengujianController@store']);
                $router->put('tujuanpengujian/{id}', ['as' => 'tujuanpengujian.update', 'uses' => 'Master\TujuanpengujianController@update']);
                $router->delete('tujuanpengujian/{id}', ['as' => 'tujuanpengujian.delete', 'uses' => 'Master\TujuanpengujianController@destroy']);

                $router->post('analyst-group', 'Master\TeamController@getDataTeam');
                $router->post('analyst-group/{id}', 'Master\TeamController@detailDataTeam');
                $router->post('analyst-group/member/{id_group}', 'Master\TeamController@dataMember');

                // $router->get('level',['as'=>'level','uses'=>'Master\LevelController@index']);
                // $router->get('level/{id}',['as'=>'level.view','uses'=>'Master\LevelController@show']);
                // $router->post('level/add', ['uses'=>'Master\LevelController@store']);
                // $router->put('level/{id}',['as'=>'level.update', 'uses'=>'Master\LevelController@update']);
                // $router->delete('level/{id}',['as'=>'level.delete','uses'=>'Master\LevelController@destroy']);

                $router->get('lod', ['as' => 'lod', 'uses' => 'Master\LodController@index']);
                $router->get('lod/{id}', ['as' => 'lod.view', 'uses' => 'Master\LodController@show']);
                $router->post('lod/add', ['uses' => 'Master\LodController@store']);
                $router->put('lod/{id}', ['as' => 'lod.update', 'uses' => 'Master\LodController@update']);
                $router->delete('lod/{id}', ['as' => 'lod.delete', 'uses' => 'Master\LodController@destroy']);

                $router->get('metode', ['as' => 'metode', 'uses' => 'Master\MetodeController@index']);
                $router->get('metode/{id}', ['as' => 'metode.view', 'uses' => 'Master\MetodeController@show']);
                $router->post('metode/add', ['uses' => 'Master\MetodeController@store']);
                $router->put('metode/{id}', ['as' => 'metode.update', 'uses' => 'Master\MetodeController@update']);
                $router->delete('metode/{id}', ['as' => 'metode.delete', 'uses' => 'Master\MetodeController@destroy']);

                $router->get('paketuji', ['as' => 'paketuji', 'uses' => 'Master\PaketujiController@index']);
                $router->get('paketuji/{id}', ['as' => 'paketuji.view', 'uses' => 'Master\PaketujiController@show']);
                $router->post('paketuji/add', ['uses' => 'Master\PaketujiController@store']);
                $router->put('paketuji/{id}', ['as' => 'paketuji.update', 'uses' => 'Master\PaketujiController@update']);
                $router->delete('paketuji/{id}', ['as' => 'paketuji.delete', 'uses' => 'Master\PaketujiController@destroy']);

                $router->get('unit', ['as' => 'unit', 'uses' => 'Master\UnitController@index']);
                $router->get('unit/{id}', ['as' => 'unit.view', 'uses' => 'Master\UnitController@show']);
                $router->post('unit/add', ['uses' => 'Master\UnitController@store']);
                $router->put('unit/{id}', ['as' => 'unit.update', 'uses' => 'Master\UnitController@update']);
                $router->delete('unit/{id}', ['as' => 'unit.delete', 'uses' => 'Master\UnitController@destroy']);

                $router->get('contract-category', ['as' => 'contactcategory', 'uses' => 'Master\ContractCategoryController@index']);
                $router->get('contract-category/{id}', ['as' => 'contactcategory.view', 'uses' => 'Master\ContractCategoryController@show']);
                $router->post('contract-category/add', ['uses' => 'Master\ContractCategoryController@store']);
                $router->put('contract-category/{id}', ['as' => 'contactcategory.update', 'uses' => 'Master\ContractCategoryController@update']);
                $router->delete('contract-category/{id}', ['as' => 'contactcategory.delete', 'uses' => 'Master\ContractCategoryController@destroy']);

                $router->post('parameteruji', ['as' => 'parameteruji', 'uses' => 'Master\ParameterUjiController@index']);
                $router->post('parameteruji-contract', ['as' => 'parameteruji', 'uses' => 'Master\ParameterUjiController@indexContract']);
                $router->get('parameteruji', ['as' => 'parameteruji', 'uses' => 'Master\ParameterUjiController@index']);
                $router->get('parameteruji/{id}', ['as' => 'parameteruji.view', 'uses' => 'Master\ParameterUjiController@show']);
                $router->post('parameteruji/add', ['uses' => 'Master\ParameterUjiController@store']);
                $router->post('parameteruji-price-add', ['uses' => 'Master\ParameterUjiController@storeHarga']);
                $router->put('parameteruji/{id}', ['as' => 'parameteruji.update', 'uses' => 'Master\ParameterUjiController@update']);
                $router->delete('parameteruji/{id}', ['as' => 'parameteruji.delete', 'uses' => 'Master\ParameterUjiController@destroy']);
                $router->get('parameterprice-accept', 'Master\ParameterUjiController@acceptPrice');
                $router->get('parametertype', ['as' => 'parametertype', 'uses' => 'Master\ParameterTypeController@index']);
                $router->get('parametertype/{id}', ['as' => 'parametertype.view', 'uses' => 'Master\ParameterTypeController@show']);
                $router->post('parametertype/add', ['uses' => 'Master\ParameterTypeController@store']);
                $router->put('parametertype/{id}', ['as' => 'parametertype.update', 'uses' => 'Master\ParameterTypeController@update']);
                $router->delete('parametertype/{id}', ['as' => 'parametertype.delete', 'uses' => 'Master\ParameterTypeController@destroy']);

                $router->get('customers', ['as' => 'customer', 'uses' => 'Analysis\CustomerController@index']);
                $router->post('customers-get', ['as' => 'customer', 'uses' => 'Analysis\CustomerController@index']);
                $router->get('customers/{id}', 'Analysis\CustomerController@show');
                $router->get('customers/get-all-cust/all', 'Analysis\CustomerController@getall');
                $router->post('customers/add', 'Analysis\CustomerController@store');
                $router->put('customers/{id}', ['as' => 'customer.update', 'uses' => 'Analysis\CustomerController@update']);
                $router->delete('customers/{id}', ['as' => 'customer.delete', 'uses' => 'Analysis\CustomerController@destroy']);
                $router->post('customers/selected', 'Analysis\CustomerController@selectedCustomer');
                $router->post('customers/generate-va', 'Analysis\CustomerController@generateVA');

                $router->get('contactpersons', ['as' => 'contactperson', 'uses' => 'Master\ContactPersonController@index']);
                $router->get('contactpersons/all', ['as' => 'contactperson', 'uses' => 'Master\ContactPersonController@getall']);
                $router->get('contactpersons/{id}', 'Master\ContactPersonController@show');
                $router->post('contactpersons/add', ['uses' => 'Master\ContactPersonController@store']);
                $router->put('contactpersons/{id}', ['as' => 'contactperson.update', 'uses' => 'Master\ContactPersonController@update']);
                $router->delete('contactpersons/{id}', ['as' => 'contactperson.delete', 'uses' => 'Master\ContactPersonController@destroy']);
                $router->post('contactpersons/selected', ['uses' => 'Master\ContactPersonController@selectedContact']);

                $router->get('samplingdata', ['as' => 'samplingdata', 'uses' => 'Master\SamplingController@index']);
                $router->get('samplingdata/{id}', ['as' => 'samplingdata.view', 'uses' => 'Master\SamplingController@show']);
                $router->post('samplingdata/add', ['uses' => 'Master\SamplingController@store']);
                $router->patch('samplingdata/{id}', ['as' => 'samplingdata.update', 'uses' => 'Master\SamplingController@update']);
                $router->delete('samplingdata/{id}', ['as' => 'samplingdata.delete', 'uses' => 'Master\SamplingController@destroy']);

                $router->get('akgdata', ['as' => 'akgdata', 'uses' => 'Master\AkgController@index']);
                $router->get('akgdata/{id}', ['as' => 'akgdata.view', 'uses' => 'Master\AkgController@show']);
                $router->post('akgdata/add', ['uses' => 'Master\AkgController@store']);
                $router->patch('akgdata/{id}', ['as' => 'akgdata.update', 'uses' => 'Master\AkgController@update']);
                $router->delete('akgdata/{id}', ['as' => 'akgdata.delete', 'uses' => 'Master\AkgController@destroy']);

                $router->get('group', ['as' => 'group', 'uses' => 'Master\GroupController@index']);
                $router->get('group/{id}', ['as' => 'group.view', 'uses' => 'Master\GroupController@show']);

                $router->post('provinces', ['as' => 'provinces', 'uses' => 'Analysis\CustomerController@provinces']);
                $router->post('regencies', ['as' => 'regencies', 'uses' => 'Analysis\CustomerController@regencies']);
                $router->get('countries', ['as' => 'countries', 'uses' => 'Analysis\CustomerController@getPhoneCode']);
            });

            $router->group(['prefix' => 'hris'], function () use ($router) {

                $router->get('attendance', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@index']);
                $router->get('chart-attendance', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@chart_attendance']);
                $router->get('rules-attendance', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@rules_attendance']);
                $router->get('get-all-attendance', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@getAllAttendance']);
                $router->post('update-attendance', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@updateAttendance']);
                $router->post('attendance', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@add']);
                $router->post('attendance-email', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@emailsend']);
                $router->patch('attendance/{id}', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@update']);
                $router->post('attendance-add-pulang', ['as' => 'attendance', 'uses' => 'Hris\AttendanceController@tambahpulang']);
                $router->get('attendance/{id}', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@show']);
                $router->delete('attendance/{id}', ['as' => 'employee.delete', 'uses' => 'Hris\AttendanceController@destroy']);
                $router->get('personal-report-attendance', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@personalreport']);
                $router->get('get-rekap-absen', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@get_rekap_absen']);
                $router->get('change-status-employee', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@change_status_employee']);
                $router->post('attendance-from-to', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@attendance_from_to']);
                $router->post('attendance-check-changing', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@checklistchangestatus']);
                $router->get('get-time', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@get_time']);
                $router->get('get-dayoff', 'Hris\AttendanceController@dayoff');
                $router->get('employement_detail', 'Hris\EmployeeController@detailemployee');

                $router->put('employee-notes/{id}', 'Hris\EmployeeNotesController@update');
                $router->post('employee-notes/add', 'Hris\EmployeeNotesController@store');
                $router->get('employee-notes/{id}', 'Hris\EmployeeNotesController@show');
                $router->delete('employee-notes/{id}', 'Hris\EmployeeNotesController@destroy');

                $router->get('get-dayoff-by-month', 'Hris\AttendanceController@dayoffbymonth');
                $router->post('add-dayoff', 'Hris\AttendanceController@add_dayoff');
                $router->delete('delete-dayoff/{id}', 'Hris\AttendanceController@delete_dayoff');
                $router->get('attendance-by-employee', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@attendance_by_employee']);
                $router->get('top-ten-late', 'Hris\AttendanceController@toptenlate');
                $router->get('late', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@late']);
                $router->get('total-late', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@totallate']);
                $router->get('chart-attendance', ['as' => 'employee.view', 'uses' => 'Hris\AttendanceController@chart_attendance']);

                $router->get('timetable', ['as' => 'division', 'uses' => 'Hris\RulesAttendanceController@index']);
                $router->post('timetable', ['as' => 'division', 'uses' => 'Hris\RulesAttendanceController@store']);
                $router->patch('timetable/{id}', ['as' => 'division', 'uses' => 'Hris\RulesAttendanceController@update']);
                $router->get('timetable/{id}', ['as' => 'division.view', 'uses' => 'Hris\RulesAttendanceController@show']);
                $router->delete('timetable/{id}', ['as' => 'division.delete', 'uses' => 'Hris\RulesAttendanceController@destroy']);

                $router->get('timetable_for', ['as' => 'division', 'uses' => 'Hris\TimetableForController@index']);
                $router->post('timetable_for', ['as' => 'division', 'uses' => 'Hris\TimetableForController@store']);
                $router->patch('timetable_for/{id}', ['as' => 'division', 'uses' => 'Hris\TimetableForController@update']);
                $router->get('timetable_for/{id}', ['as' => 'division.view', 'uses' => 'Hris\TimetableForController@show']);
                $router->delete('timetable_for/{id}', ['as' => 'division.delete', 'uses' => 'Hris\TimetableForController@destroy']);

                $router->post('employee', ['as' => 'employee', 'uses' => 'Hris\EmployeeController@index']);
                $router->post('employee-sales', ['as' => 'employeed', 'uses' => 'Hris\EmployeeController@sales_employee']);
                $router->post('employee/add', ['as' => 'employee', 'uses' => 'Hris\EmployeeController@store']);
                $router->patch('employee/{id}', ['as' => 'employee', 'uses' => 'Hris\EmployeeController@update']);
                $router->get('employee/{id}', ['as' => 'employee.view', 'uses' => 'Hris\EmployeeController@show']);
                $router->delete('employee/{id}', ['as' => 'employee.delete', 'uses' => 'Hris\EmployeeController@destroy']);

                $router->get('employee_education/{id}', ['as' => 'employee_education', 'uses' => 'Hris\EmployeeController@education']);
                $router->get('competence/{id}', ['as' => 'competence', 'uses' => 'Hris\EmployeeController@competence']);

                $router->get('pengujian', ['as' => 'pengujian', 'uses' => 'Hris\PengujianController@index']);
                $router->get('pengujian/{id}', ['as' => 'pengujian.view', 'uses' => 'Hris\PengujianController@show']);
                $router->delete('pengujian/{id}', ['as' => 'pengujian.delete', 'uses' => 'Hris\PengujianController@destroy']);

                $router->get('parameter', ['as' => 'parameter', 'uses' => 'Hris\ParameterController@index']);
                $router->get('parameter/{id}', ['as' => 'parameter.view', 'uses' => 'Hris\ParameterController@show']);
                $router->delete('parameter/{id}', ['as' => 'parameter.delete', 'uses' => 'Hris\ParameterController@destroy']);

                $router->get('level', ['as' => 'level', 'uses' => 'Hris\LevelController@index']);
                $router->get('level/{id}', ['as' => 'level.view', 'uses' => 'Hris\LevelController@show']);
                $router->delete('level/{id}', ['as' => 'level.delete', 'uses' => 'Hris\LevelController@destroy']);
                $router->post('level/add', 'Hris\LevelController@store');
                $router->put('level/{id}', 'Hris\LevelController@update');

                $router->get('sister-company', ['as' => 'level', 'uses' => 'Hris\SisterCompanyController@index']);
                $router->get('sister-company/{id}', ['as' => 'level.view', 'uses' => 'Hris\SisterCompanyController@show']);
                $router->delete('sister-company/{id}', ['as' => 'level.delete', 'uses' => 'Hris\SisterCompanyController@destroy']);
                $router->post('sister-company', 'Hris\SisterCompanyController@store');
                $router->put('sister-company/{id}', 'Hris\SisterCompanyController@update');

                $router->get('status-desc', ['as' => 'level', 'uses' => 'Hris\StatusDescController@index']);
                $router->get('status-desc/{id}', ['as' => 'level.view', 'uses' => 'Hris\StatusDescController@show']);

                $router->get('position-tree', ['as' => 'level', 'uses' => 'Hris\PositionTreeController@index']);
                $router->get('position-tree/{id}', ['as' => 'level.view', 'uses' => 'Hris\PositionTreeController@show']);
                $router->delete('position-tree/{id}', ['as' => 'level.delete', 'uses' => 'Hris\PositionTreeController@destroy']);
                $router->post('position-tree', 'Hris\PositionTreeController@store');
                $router->put('position-tree/{id}', 'Hris\PositionTreeController@update');

                $router->get('status-attendance', 'Hris\StatusAttendanceController@index');
                $router->get('status-attendance/{id}', 'Hris\StatusAttendanceController@show');
                $router->post('status-attendance', 'Hris\StatusAttendanceController@store');
                $router->patch('status-attendance/{id}', 'Hris\StatusAttendanceController@update');
                $router->delete('status-attendance/{id}', 'Hris\StatusAttendanceController@destroy');

                $router->get('position', ['as' => 'position', 'uses' => 'Hris\PositionController@index']);
                $router->get('position/{id}', ['as' => 'position.view', 'uses' => 'Hris\PositionController@show']);
                $router->delete('position/{id}', ['as' => 'position.delete', 'uses' => 'Hris\PositionController@destroy']);

                $router->get('division', ['as' => 'division', 'uses' => 'Hris\DivisionController@index']);
                $router->post('division', ['as' => 'division', 'uses' => 'Hris\DivisionController@store']);
                $router->patch('division/{id}', ['as' => 'division', 'uses' => 'Hris\DivisionController@update']);
                $router->get('division/{id}', ['as' => 'division.view', 'uses' => 'Hris\DivisionController@show']);
                $router->delete('division/{id}', ['as' => 'division.delete', 'uses' => 'Hris\DivisionController@destroy']);

                $router->get('departement', ['as' => 'departement', 'uses' => 'Hris\DepartementController@index']);
                $router->post('departement', ['as' => 'departement', 'uses' => 'Hris\DepartementController@store']);
                $router->patch('departement/{id}', ['as' => 'departement', 'uses' => 'Hris\DepartementController@update']);
                $router->get('departement/{id}', ['as' => 'departement.view', 'uses' => 'Hris\DepartementController@show']);
                $router->delete('departement/{id}', ['as' => 'departement.delete', 'uses' => 'Hris\DepartementController@destroy']);

                $router->get('sub-division', 'Hris\SubdivisionController@index');
                $router->get('sub-division-by-div', 'Hris\SubdivisionController@setsubdiv');
                $router->get('sub-division/{id}', 'Hris\SubdivisionController@show');
                $router->post('sub-division', 'Hris\SubdivisionController@store');
                $router->patch('sub-division/{id}', 'Hris\SubdivisionController@update');
                $router->delete('sub-division/{id}', 'Hris\SubdivisionController@destroy');

                $router->get('experience/{idemployee}', ['as' => 'experience', 'uses' => 'Hris\EmployeeController@experience']);

                $router->get('level-employee-history', 'Hris\EmployeeController@leveldet');
                $router->get('status-employee-history', 'Hris\EmployeeController@statusDet');
                $router->get('employeement-det-show/{id}', 'Hris\EmployeeController@show_det_employement');
                $router->post('add-level-history', 'Hris\EmployeeController@addLevel');
                //asdasd//
                $router->post('add-status-history', 'Hris\EmployeeController@addStatus');
                $router->get('set-export-employee', 'Hris\EmployeeController@getExportData');
                $router->post('add-education-history', 'Hris\EmployeeController@addEducationHistory');
                $router->post('add-administration-history', 'Hris\EmployeeController@addAdministrationHistory');
                $router->get('get-administration-karyawan', 'Hris\EmployeeController@administrationKaryawan');
                $router->get('get-status-karyawan', 'Hris\EmployeeController@statusKaryawan');
                $router->get('get-education-karyawan', 'Hris\EmployeeController@educationKaryawan');
                $router->post('add-administrative-history', 'Hris\EmployeeController@addadministrative');
                $router->post('employeement-det-add', 'Hris\EmployeeController@saving_det_employement');
                $router->get('employeement-det-history', 'Hris\EmployeeController@detailemployeehistory');
                $router->get('administration-det-history', 'Hris\EmployeeController@detailAdministrationHistory');
                $router->get('education-det-history', 'Hris\EmployeeController@detaileducationhistory');
                $router->post('set-status-employee', 'Hris\EmployeeController@setActiveEmployee');
                $router->post('update-status-employee/{id}', 'Hris\EmployeeController@updateActiveEmployee');
                $router->get('status-active-employee', 'Hris\EmployeeController@statusactive');
                $router->delete('employeement-det-delete/{id}', 'Hris\EmployeeController@delete_det_employement');
                $router->delete('education-history-delete/{id}', 'Hris\EmployeeController@delete_education_history');
                $router->delete('administration-history-delete/{id}', 'Hris\EmployeeController@delete_administration_history');
                $router->delete('delete-level-history/{id}', 'Hris\EmployeeController@delete_level_history');
                $router->delete('delete-status-history/{id}', 'Hris\EmployeeController@delete_status_history');
            });

            $router->group(['prefix' => 'analystpro'], function () use ($router) {


                $router->group(['prefix' => 'products'], function () use ($router) {
                    $router->post('attachment-data/{id}', ['uses' => 'Products\ContractProductController@sendAttachment']);
                    $router->post('attachment-data/bloob/data-photo', ['uses' => 'Products\ContractProductController@sendAttachmentBlob']);
                    $router->post('attachment-data/get-photo/data', ['uses' => 'Products\ContractProductController@getPhotoContractProduct']);

                    $router->post('getmedia-rtu', ['uses' => 'Products\Mediartu\MediartuController@productsmediatru']);
                    $router->post('contract/mediartu', ['uses' => 'Products\Mediartu\MediartuController@contractMediartu']);
                    $router->post('contract/mediartu/details', ['uses' => 'Products\Mediartu\MediartuController@mediaRtuDetail']);
                    $router->post('add-contract/media-rtu', ['uses' => 'Products\ContractProductController@addContractMediaRTU']);
                    $router->post('contract/mediartu/get-products', ['uses' => 'Products\Mediartu\MediartuController@getProductinContract']);
                    $router->post('contract/mediartu/approve/toLab', ['uses' => 'Products\Mediartu\MediartuController@mediaRtuApprove']);
                    $router->post('contract/mediartu/delete-data', ['uses' => 'Products\Mediartu\MediartuController@deleteData']);
                    $router->post('edit-contract/media-rtu', ['uses' => 'Products\ContractProductController@editMediaRtu']);

                    $router->post('get-value/product/contract/media-rtu', ['uses' => 'Products\Mediartu\MediartuController@getMediaRtuProduct']);


                    $router->post('edit-contract', ['uses' => 'Products\ContractProductController@getDetail']);
                    $router->post('contract/media-rtu/detail/product', ['uses' => 'Products\Mediartu\MediartuController@sendingMediaRtu']);



                    $router->post('getdioxine-udara', ['uses' => 'Products\Dioxine\DioxineUdaraController@dioxineudara']);
                    $router->post('contract/dioxinudara', ['uses' => 'Products\Dioxine\DioxineUdaraController@contractDioxineUdara']);

                    $router->post('finance', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@invoiceProduct']);
                    $router->post('finance/detail', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@invoiceProductDetail']);
                    $router->post('finance/detail/dioxin', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@invoiceProductDioxineDetail']);

                    $router->post('finance/detail/save-data/{id}', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@submitInvoice']);
                    $router->post('finance/approved/waiting', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@waitingApproved']);
                    $router->post('finance/detail/prints', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@printInvoice']);

                    $router->post('approve-finance/index', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@ApproveFinanceIndex']);
                    $router->post('approve-finance/approved', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@ApprovedInvoice']);

                    $router->post('finance/payment/submit', ['uses' => 'Products\Finance\Invoice\InvoiceProductController@submitPayments']);


                    $router->post('lab/approval', ['uses' => 'Products\Lab\LabProductController@indexApprove']);
                    $router->post('lab/approval/change-status', ['uses' => 'Products\Lab\LabProductController@changeStatus']);
                    $router->post('lab/approval/approv/media', ['uses' => 'Products\Lab\LabProductController@approveMedia']);

                    $router->post('lab/media-rtu', ['uses' => 'Products\Lab\LabProductController@mediaRtu']);
                    $router->post('lab/media-rtu/details', ['uses' => 'Products\Lab\LabProductController@detailmediaRtu']);
                    $router->post('lab/media-rtu/details/submit', ['uses' => 'Products\Lab\LabProductController@coaMediaRtu']);

                    $router->post('attachment/delete-data', ['uses' => 'Products\ContractProductController@deleteAttachment']);

                    $router->post('mediartu/get-progress', ['uses' => 'Products\Lab\LabProductController@getProgressMediartu']);
                    $router->post('mediartu/progress', ['uses' => 'Products\Lab\LabProductController@progressMediartu']);

                    $router->post('mediartu/add/add-new-contact', ['uses' => 'Products\ContractProductController@createContactPerson']);
                });

                $router->group(['prefix' => 'connect'], function () use ($router) {
                    $router->post('user-data', ['uses' => 'Analysis\UserCustomerController@index']);
                    $router->post('user-data/add', ['uses' => 'Analysis\UserCustomerController@addUserCustomer']);
                    $router->post('user-data/update', ['uses' => 'Analysis\UserCustomerController@updateUserCustomer']);
                    $router->post('user-data/delete', ['uses' => 'Analysis\UserCustomerController@deleteUserCustomer']);
                });

                //dashboard
                $router->get('pivot-sample-parameter-lab', 'Analysis\DashboardController@report_lab_jumlah_parameter_sample');
                $router->get('delete-contract-sebagian', 'Analysis\KontrakujiController@deletedelete');
                $router->get('summary-contract', 'Analysis\DashboardController@summary_contract');
                $router->get('check-condition-contract', 'Analysis\KontrakujiController@checkconditioncs');
                $router->get('customer-behaviour', 'Analysis\DashboardController@customerbehaviour');
                $router->get('parameter-add-info', 'Analysis\DashboardController@parameteraddinfo');
                $router->get('customer-amount', 'Analysis\DashboardController@customeramount');
                $router->get('sale-type', 'Analysis\DashboardController@saletype');
                $router->get('total-parameter', 'Analysis\DashboardController@total_parameter_perlab');
                $router->get('total-sample', 'Analysis\DashboardController@jumlah_sample');
                $router->get('total-sample-per-category', 'Analysis\DashboardController@jumlah_sample_per_category');
                $router->get('total-transaction-parameter', 'Analysis\DashboardController@jumlah_parameter');
                $router->get('summary-transaction-by-statuspengujian', 'Analysis\DashboardController@getdatasample');
                $router->get('summary-parametertype', 'Analysis\DashboardController@jumlah_parametertype');
                //end dashboard


                //preparation
                $router->post('preparation', ['as' => 'preparation.view', 'uses' => 'Analysis\PreparationController@preparationContract']);
                $router->get('preparation/{id_contract}', ['as' => 'preparation.view', 'uses' => 'Analysis\PreparationController@showContract']);

                $router->post('sampletransaction', ['as' => 'sampletransaction.view', 'uses' => 'Analysis\PreparationController@SampleContract']);
                $router->post('sampleDetail', ['as' => 'sampledetail.view', 'uses' => 'Analysis\PreparationController@sampleDetail']);
                $router->post('sampleDetail/check', ['as' => 'sampledetail.view', 'uses' => 'Analysis\PreparationController@SampleCheckDetailsNew']);
                $router->post('parametertransaction', ['as' => 'parametertransaction.view', 'uses' => 'Analysis\PreparationController@parameterContract']);
                $router->post('bobotsampleadd', ['uses' => 'Analysis\PreparationController@saveBobotSample']);
                $router->post('bobotsampledit', ['as' => 'bobotsampledit.update', 'uses' => 'Analysis\PreparationController@editBobotSample']);

                $router->post('sample-check', ['as' => 'bobotsampledit.update', 'uses' => 'Analysis\PreparationController@sampleCheck']);
                $router->get('sample-check/{id_sample}', ['as' => 'bobotsampledit.update', 'uses' => 'Analysis\PreparationController@SampleCheckDetails']);
                $router->post('sample-check/check', ['as' => 'bobotsampledit.update', 'uses' => 'Analysis\PreparationController@limitSampleCheck']);
                $router->post('sample-status', ['as' => 'bobotsampledit.update', 'uses' => 'Analysis\PreparationController@sampleChangeStatus']);
                $router->post('accepted-preparation', 'Analysis\PreparationController@accepted_preparation');

                $router->post('approve-sample', ['as' => 'preparation.approvesample', 'uses' => 'Analysis\PreparationController@approveDataSample']);
                $router->post('approve-sample-to-lab', ['as' => 'preparation.approvesample.tolab', 'uses' => 'Analysis\PreparationController@approveDataSampleToLab']);
                $router->post('sampletest/approve', ['as' => 'bobotsampledit.approveSampleTest', 'uses' => 'Analysis\PreparationController@approveSampleTest']);
                $router->post('sampletest/approve/one', ['as' => 'bobotsampledit.approveSampleTest', 'uses' => 'Analysis\PreparationController@approveOneSampleTest']);
                $router->post('preparation/getbobot', ['as' => 'getbobot', 'uses' => 'Analysis\PreparationController@getDataBobot']);
                $router->post('preparation/postbobot', ['as' => 'postbobot', 'uses' => 'Analysis\PreparationController@addDataBobot']);
                $router->post('preparation/deletebobot', ['as' => 'deletebobot', 'uses' => 'Analysis\PreparationController@deletedDataBobot']);
                $router->post('memo-kendali', ['as' => 'memo_kendali', 'uses' => 'Analysis\PreparationController@memo_kendali']);
                $router->post('memo-preparation/get/data-desc', ['as' => 'memo_preparation', 'uses' => 'Analysis\PreparationController@getDescription']);
                $router->post('memo-preparation/update/data-desc/post', ['as' => 'updateDataDescription', 'uses' => 'Analysis\PreparationController@updateDataDescription']);
                $router->post('memo-preparation/update/data-desc/bulk-post', ['as' => 'updateDataDescription', 'uses' => 'Analysis\PreparationController@updateDataDescriptionBulk']);


                $router->post('history-preparation', ['as' => 'history-preparation.view', 'uses' => 'Analysis\PreparationController@historyPreparation']);
                $router->post('history-preparation/to-control', ['as' => 'history-preparation.control', 'uses' => 'Analysis\PreparationController@deleteHistory']);
                $router->post('history-preparation/download/excel', ['as' => 'history-preparation.excel', 'uses' => 'Analysis\PreparationController@historyDownload']);
                //end preparation

                // keuangan

                $router->get('accept-invoice', 'Analysis\FinanceController@accept_invoice');
                $router->get('excel-export', 'Analysis\FinanceController@excelexport');
                $router->get('get-data-invoice-payment', 'Analysis\FinanceController@payment_invoice_get');
                $router->post('view-kontrak-finance', 'Analysis\FinanceController@index');

                $router->post('view-kontrak-finance-detail', 'Analysis\FinanceController@show');
                $router->post('view-kontrak-finance-detail/detail-finance', 'Analysis\FinanceController@detailFinanceContract');
                $router->get('view-detail-edit-invoice', 'Analysis\FinanceController@for_edit');

                $router->post('view-kontrak-finance-detail/check-contract', 'Analysis\FinanceController@checkContract');
                $router->post('view-kontrak-finance-detail/checksplit', 'Analysis\FinanceController@checkSplit');

                $router->get('bank-account', 'Analysis\FinanceController@accountBank');
                $router->get('account-bank', 'Analysis\FinanceController@bankaccount');
                $router->post('add-invoice', 'Analysis\FinanceController@add');
                $router->post('add-invoice/with-discount', 'Analysis\FinanceController@addWithDiscount');
                $router->get('sample-data', 'Analysis\FinanceController@getSampleData');
                $router->get('contract-list', 'Analysis\FinanceController@getKontrak');
                $router->post('selecting-index-invoice', 'Analysis\FinanceController@selectingindex');
                $router->post('edit-invoice', 'Analysis\FinanceController@edit_invoice');
                $router->post('edit-invoice/withdisc', 'Analysis\FinanceController@editInvoiceWithDiscount');
                $router->post('payment-action', 'Analysis\FinanceController@paymment_action');

                $router->post('payment-add', 'Analysis\FinanceController@paymentAdd');
                $router->get('payment/{idcontract}', 'Analysis\FinanceController@getPayment');
                $router->post('payment/delete-payment', 'Analysis\FinanceController@deletePaymentData');

                $router->post('hold-contract', 'Analysis\FinanceController@editHold');

                $router->post('finance', ['as' => 'finance.view', 'uses' => 'Analysis\FinanceController@marketingFinance']);
                $router->post('invoice-approve', 'Analysis\FinanceController@indexApprove');
                $router->post('invoice-approve/approve-data', 'Analysis\FinanceController@approveInvoice');
                $router->post('invoice-approve/cancel-data', 'Analysis\FinanceController@cancelInvoice');
                $router->post('invoice-approve/hold-contract', 'Analysis\FinanceController@holdContract');
                $router->post('invoice-approve/hold-contract/by-invoice', 'Analysis\FinanceController@holdContractByInvoice');
                $router->post('invoice-approve/hold-contract/by-contract', 'Analysis\FinanceController@holdContractData');


                $router->post('view-invoice-special', 'Analysis\FinanceController@invoiceSpesial');
                $router->post('view-invoice-special/approve-invoice', 'Analysis\FinanceController@approveSpecialInvoice');

                $router->post('invoice/changestatus/action', 'Analysis\FinanceController@activeStatus');

                $router->group(['prefix' => 'invoice'], function () use ($router) {
                    // $router->get('detail/{id}','Analysis\FinanceController@detailInvoice');
                    $router->get('data/{id}', 'Analysis\FinanceController@dataInvoice');
                    $router->get('sample-detail/{idinvoice}', 'Analysis\FinanceController@getSampleInvoice');
                    $router->post('selected-customer', 'Analysis\FinanceController@selectedCustomer');
                    $router->post('selected-contact', 'Analysis\FinanceController@selectedContact');
                    $router->post('selected-address', 'Analysis\FinanceController@selectedAddress');
                    $router->post('{id}', 'Analysis\FinanceController@editInvoice');

                    $router->post('printed/popow', 'Analysis\FinanceController@printInvoice');

                    $router->post('check-customer/customers', 'Analysis\FinanceController@getCustomerInvoice');
                    $router->post('check-cp/cp', 'Analysis\FinanceController@getCPInvoice');
                    $router->post('check-address/address', 'Analysis\FinanceController@getAddressInvoice');
                    $router->post('delete/invoice', 'Analysis\FinanceController@deleteInvoce');
                    $router->post('update/invoice', 'Analysis\FinanceController@updateNewData');
                    $router->post('update/calculation', 'Analysis\FinanceController@calculationData');

                    $router->post('get/desc', 'Analysis\FinanceController@getDescription');
                    $router->post('post/description', ['as' => 'invoice.update.sample.desc', 'uses' => 'Analysis\FinanceController@postDescription']);

                    $router->post('data/get-invoice/contract', 'Analysis\FinanceController@getInvoiceByContract');
                    $router->post('actived-invoice/updatedata', 'Analysis\FinanceController@activedInvoice');

                    $router->post('get-user/top-globals', 'Analysis\FinanceController@userTopGlobal');
                    $router->post('get-price/total-invoice-day', 'Analysis\FinanceController@totalInvoiceDay');
                    $router->post('get-data/summary-invoice-day', 'Analysis\FinanceController@summaryInvoiceDay');
                });
                $router->get('finance/user-finance', 'Analysis\FinanceController@userFinance');
                $router->post('finance/finder-contract', ['as' => 'finance.view', 'uses' => 'Analysis\FinanceController@FinderInfoice']);

                $router->post('finance/get-sample', ['as' => 'finance.view', 'uses' => 'Analysis\FinanceController@getDatainLab']);

                $router->post('finance/performa/invoice/get-data', 'Analysis\FinanceController@getPerforma');
                $router->post('finance/approve/revision/data', 'Analysis\FinanceController@approveRevision');
                // End keuangan


                // Penawaran

                $router->post('penawaran', 'Analysis\PenawaranController@index');
                $router->get('penawaran-contract', 'Analysis\PenawaranController@index_contract');
                $router->post('penawaran-add', 'Analysis\PenawaranController@penawaranAdd');
                $router->get('penawaran-excel-export', 'Analysis\PenawaranController@exportExcel');
                $router->get('penawaran-detail/{id}', 'Analysis\PenawaranController@penawaranDetail');
                $router->get('penawaran-approve', 'Analysis\PenawaranController@penawaranApprove');
                $router->get('penawaran-set-contract/{id}', 'Analysis\PenawaranController@setPenawaran2');
                $router->get('penawaran-set-contract', 'Analysis\PenawaranController@setPenawaran');
                $router->get('penawaran-customer', 'Analysis\PenawaranController@penawaran_customer');
                $router->get('penawaran-attachment', 'Analysis\PenawaranController@getAttachment');
                $router->post('send-attachment-penawaran/{id}', 'Analysis\PenawaranController@sendAttachment');

                // End Penawaran

                // Lab
                $router->post('indexing', 'Analysis\LabController@indexfor');
                $router->post('indexingfor', 'Analysis\LabController@indexfor2');
                $router->post('indexingfor3', 'Analysis\LabController@difference');
                $router->get('get-info-parameter', 'Analysis\LabController@getInfoParameter');
                $router->get('indexing-get', 'Analysis\LabController@indexforget');
                $router->get('lab-view', ['uses' => 'Analysis\LabController@index']);
                $router->get('lab-data-count', ['uses' => 'Analysis\LabController@getDataCount']);
                $router->get('lab-info', ['uses' => 'Analysis\LabController@labinfo']);
                $router->get('lab-approve', 'Analysis\LabController@contract_lab');
                $router->post('send-sample-certificate', 'Analysis\LabController@sendSampletoCertificate');
                $router->get('export-data', 'Analysis\LabController@exportFunction');
                $router->get('get-contract-param', 'Analysis\LabController@get_contract_parameter');
                $router->get('memo-lab', 'Analysis\LabController@memolab');
                $router->get('get-parameter-info', 'Analysis\LabController@contekanlab');
                $router->get('get-sample-accepted', 'Analysis\LabController@getSampleAccepted');
                $router->get('test-conn', 'Analysis\LabController@ioioi');
                $router->get('excel-spk', 'Analysis\LabController@excelSpk');
                $router->get('excel-format-hasil', 'Analysis\LabController@export_format_hasil');
                $router->get('excel-format-hasil-by-contract', 'Analysis\LabController@exportformathasilbycontract');
                $router->post('import-data', 'Analysis\LabController@importFunction');
                $router->post('save-hasil', ['uses' => 'Analysis\LabController@save']);
                $router->post('save-hasil-approval', ['uses' => 'Analysis\LabController@save_approval']);
                $router->post('save-excuse', ['uses' => 'Analysis\LabController@savexcuse']);
                $router->post('accept-lab', 'Analysis\LabController@sampleAccept');
                $router->post('changestatuslab', 'Analysis\LabController@changeStatusLab');
                $router->post('get-sample-approve', 'Analysis\LabController@approve_get_sample');
                $router->post('lab-process-approve', 'Analysis\LabController@approve_lab_process');
                $router->post('lab-done-unapprove', 'Analysis\LabController@unapprove_lab_done');
                $router->get('description-sample', 'Analysis\LabController@description');
                $router->post('selected-index', 'Analysis\LabController@selecting');
                $router->post('selected-index-contract', 'Analysis\LabController@getcontractno');
                $router->post('selected-index-sample', 'Analysis\LabController@getsample');
                $router->post('selected-index-parameteruji', 'Analysis\LabController@getparameteruji');
                $router->post('selected-index-hasiluji', 'Analysis\LabController@gethasiluji');
                $router->post('manager-approve', 'Analysis\LabController@manager_approve');
                $router->get('sample-photo', 'Analysis\LabController@samplephoto');
                $router->post('save-kesimpulan', 'Analysis\LabController@saveKesimpulan');
                //end lab

                //kendali
                $router->post('kendali', ['as' => 'kendali', 'uses' => 'Analysis\KendaliController@index']);
                $router->post('kendali/approve-contract', ['as' => 'kendali.app', 'uses' => 'Analysis\KendaliController@ApproveContract']);

                $router->get('kendali/{id_contract}', ['as' => 'kendali.view', 'uses' => 'Analysis\KendaliController@showContract']);
                $router->post('kendali/sample', ['as' => 'kendali.sample.sampleInContract', 'uses' => 'Analysis\KendaliController@getSampleInContract']);
                $router->get('kendali/{id_contract}/description', ['as' => 'kendali.view.sample.desc', 'uses' => 'Analysis\KendaliController@getDescription']);
                $router->post('kendali/{id_contract}/description', ['as' => 'kendali.update.sample.desc', 'uses' => 'Analysis\KendaliController@updateDataDescription']);
                $router->get('kendali/sample/{id_sample}/data', ['as' => 'kendali.sample.showSample', 'uses' => 'Analysis\KendaliController@showSample']);
                $router->post('kendali/sample/{id_sample}/data', ['as' => 'kendali.update.sample', 'uses' => 'Analysis\KendaliController@updateDataSample']);
                $router->post('kendali/sample/data/bulk', ['as' => 'kendali.update.sample', 'uses' => 'Analysis\KendaliController@updateBulkDataSample']);
                $router->post('kendali/sample/parameter/update/bulk-data/all-sample', ['as' => 'kendali.sample.updateBulkParameter', 'uses' => 'Analysis\KendaliController@updateBulkParameterSample']);
                $router->post('kendali/sample/{id_sample}/paste', ['as' => 'kendali.update.sample.paste', 'uses' => 'Analysis\KendaliController@pasteDataSample']);
                $router->post('kendali/sample/paste-all/{id_contract}', ['as' => 'kendali.update.sample.pasteAll', 'uses' => 'Analysis\KendaliController@pasteAllEstimateData']);
                $router->post('kendali/sample/approve', ['as' => 'kendali.sample.showSample', 'uses' => 'Analysis\KendaliController@approveSample']);
                $router->post('kendali/sample/photo', ['as' => 'kendali.sample.showPhotoSample', 'uses' => 'Analysis\KendaliController@showPhotoSample']);
                $router->post('kendali/sample/addphoto', ['as' => 'kendali.sample.addPhotoKendali', 'uses' => 'Analysis\KendaliController@addPhotoKendali']);

                $router->post('kendali/sample/parameter', ['as' => 'kendali.sample.parameterInSample', 'uses' => 'Analysis\KendaliController@showParameterInSample']);


                $router->get('kendali/sample/parameter/{id_parameter}', ['as' => 'kendali.sample.showparamerter', 'uses' => 'Analysis\KendaliController@showParameter']);
                $router->post('kendali/sample/parameter/{id_parameter}/update', ['as' => 'kendali.sample.updateParameter', 'uses' => 'Analysis\KendaliController@updateParameter']);
                $router->post('kendali/sample/parameter/update/bulk-data', ['as' => 'kendali.sample.updateBulkParameter', 'uses' => 'Analysis\KendaliController@updateBulkParameter']);
                $router->post('kendali/sample/parameter/{id_parameter}/paste', ['as' => 'kendali.sample.pasteParameter', 'uses' => 'Analysis\KendaliController@pasteParameter']);
                $router->post('kendali/sample/{id_sample}/paste-all', ['as' => 'kendali.sample.pasteAllParameter', 'uses' => 'Analysis\KendaliController@pasteAllParameter']);

                $router->post('kendali/sample/paste-all/contract/{id_parameter}', ['as' => 'kendali.sample.pasteAllParameterInContract', 'uses' => 'Analysis\KendaliController@pasteAllParameterInContract']);

                $router->post('kendali/excel-export/data-report', ['as' => 'kendali.sample.showparamerter', 'uses' => 'Analysis\KendaliController@excelexport']);
                $router->post('kendali/backtrack/contract', ['as' => 'kendali.sample.backContract', 'uses' => 'Analysis\KendaliController@backContract']);
                $router->post('kendali/sample/get-team', ['as' => 'kendali.sample.getTeamSample', 'uses' => 'Analysis\KendaliController@getTeamSample']);
                //end kendali

                // customer mou
                //
                $router->post('customer-mou', 'Master\MouController@index');
                $router->delete('customer-mou/{id}', 'Master\MouController@destroy');
                $router->post('customer-mou-add', 'Master\MouController@store');
                $router->patch('customer-mou/{id}', 'Master\MouController@update');
                $router->get('customer-mou-detail', 'Master\MouController@show');
                $router->post('customer-mou-update', 'Master\MouController@update');
                $router->get('mou-attachment', 'Master\MouController@mouattachment');
                $router->post('send-attachment-mou/{id}', 'Master\MouController@sendAttachment');
                $router->get('approve-mou', 'Master\MouController@approveMou');
                $router->get('delete-attachment-mou', 'Master\MouController@deleteAttachment');
                $router->get('hargaanehpaket', 'Analysis\KontrakujiController@hargaanehpaket');

                // end customer mou

                //sertifikat
                $router->post('result-sample', ['as' => 'result-sample', 'uses' => 'Analysis\ResultofAnalystController@getDataResult']);
                $router->get('result-sample/{id_contract}', ['as' => 'certificate', 'uses' => 'Analysis\ResultofAnalystController@getDetailContract']);
                $router->post('result-sample/sample', ['as' => 'certificate', 'uses' => 'Analysis\ResultofAnalystController@getSample']);
                $router->get('result-sample/sample/{id_sample}', ['as' => 'certificate', 'uses' => 'Analysis\ResultofAnalystController@getDetailSample']);

                $router->post('admin-certificate', ['as' => 'certificate', 'uses' => 'Analysis\CertificateController@certificate']);
                //$router->post('admin-certificate/add',['as'=>'certificate.add','uses'=>'Analysis\CertificateController@addTeam']);
                $router->post('admin-certificate/{id_kontrakuji}', ['as' => 'certificate-detail', 'uses' => 'Analysis\CertificateController@certificateDetail']);
                $router->get('admin-certificate/contract/{id_kontrakuji}', ['as' => 'certificate-detail', 'uses' => 'Analysis\CertificateController@certificateContractDetail']);
                $router->get('admin-certificate/get-info/{id_sample}', ['as' => 'certificate.getPrintInfo', 'uses' => 'Analysis\CertificateController@getPrintInfo']);
                $router->post('admin-certificate/get-info/{id_sample}/post', ['as' => 'certificate.addPrintInfo', 'uses' => 'Analysis\CertificateController@addPrintInfo']);
                $router->post('admin-certificate/{id_kontrakuji}/email', ['as' => 'emailUpdate', 'uses' => 'Analysis\CertificateController@emailUpdate']);
                $router->post('admin-certificate/getdata/reportcertificate/download', ['as' => 'getDataKpi', 'uses' => 'Analysis\CertificateController@getDataKpi']);


                $router->post('certificate', ['as' => 'certificate', 'uses' => 'Analysis\CertificateController@index']);
                $router->get('certificate/{id_contract}', ['as' => 'certificate.showContract', 'uses' => 'Analysis\CertificateController@showContract']);
                $router->post('certificate/{id_contract}/sample-lab', ['as' => 'certificate.sampleLab', 'uses' => 'Analysis\CertificateController@showSampleLab']);
                $router->get('certificate/sample/{id_sample}', ['as' => 'certificate.showDetailSample', 'uses' => 'Analysis\CertificateController@showDetailSample']);
                $router->post('certificate/sample/{id_sample}/search-customer', ['as' => 'certificate.searchCustomer', 'uses' => 'Analysis\CertificateController@searchCustomer']);
                $router->get('certificate/samplelab/{id_sample}', ['as' => 'certificate.showDetailSampleLab', 'uses' => 'Analysis\CertificateController@showDetailSampleLab']);
                $router->get('certificate/sample/{id_sample}/parameter', ['as' => 'certificate.showDetailSample', 'uses' => 'Analysis\CertificateController@showParameterData']);
                $router->post('certificate/sample/makelhu', ['as' => 'certificate.makeLhu', 'uses' => 'Analysis\CertificateController@makeLhu']);
                $router->post('certificate/{id_contract}/lhu', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@dataLhu']);
                $router->post('certificate/{id_contract}/lhu-with-parameter', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@dataLhuwithParameter']);
                $router->post('certificate/{id_contract}/lhu-with-parameter-one', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@dataLhuwithOneParameter']);

                $router->get('certificate/sample/cert/{id_sample}', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@detailSample']);
                $router->get('certificate-export-sample-info', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@samplecertinfo']);

                $router->post('certificate/akg/parameter/submit-akg', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@submitAkg']);
                $router->get('certificate/akg/fomat/selected', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@akgFormat']);
                $router->post('certificate/akg/parameter/approve-akg-staff', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@approveAkg']);

                $router->post('certificate/akg/list-approval', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@listApproveAkg']);
                $router->post('certificate/akg/list-approval/approve', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@approveChecklistAkg']);

                $router->post('certificate/akg/show-data', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@showAkg']);

                // $router->post('certificate/{id_contract}/lhu/get-akg',['as'=>'certificate.LHU','uses'=>'Analysis\CertificateController@dataLhu']);

                $router->post('certificate/parameter/update', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@parameterUpdate']);
                $router->post('certificate/parameter/listing/updated', ['as' => 'certificate.LHU', 'uses' => 'Analysis\CertificateController@parameterListing']);
                $router->post('certificate/sample/cert/duplicate', ['as' => 'certificate.LHU.duplicate', 'uses' => 'Analysis\CertificateController@duplicateCertificate']);
                $router->post('certificate/sample/cert/duplicate/revision', ['as' => 'certificate.LHU.duplicate.revision', 'uses' => 'Analysis\CertificateController@duplicateCertificateRev']);
                $router->post('certificate/sample/cert/getnumber', ['as' => 'certificate.LHU.getnumber', 'uses' => 'Analysis\CertificateController@getNumber']);
                $router->post('certificate/sample/cert/getnumberrev', ['as' => 'certificate.LHU.getnumber', 'uses' => 'Analysis\CertificateController@getNumberRevision']);
                $router->post('certificate/sample/parameter', ['as' => 'certificate.parameter', 'uses' => 'Analysis\CertificateController@showParameterInCertificate']);
                $router->post('certificate/sample/parameter/add', ['as' => 'certificate.parameter.add', 'uses' => 'Analysis\CertificateController@addCertificateParameter']);
                $router->post('certificate/sample/cert/updatecertificate', ['as' => 'certificate.LHU.getnumber', 'uses' => 'Analysis\CertificateController@updateCertificateData']);
                $router->delete('certificate/sample/cert/delete/{id_sample}', ['as' => 'certificate.LHU.getnumber', 'uses' => 'Analysis\CertificateController@deleteResultOfAnalisys']);
                $router->post('certificate/sample/cert/delete/bulkDelete', ['as' => 'certificate.LHU.bulkdelete', 'uses' => 'Analysis\CertificateController@bulkdeleteResultOfAnalisys']);
                $router->post('certificate/sample/cert/approve-staff', ['as' => 'certificate.LHU.getnumber', 'uses' => 'Analysis\CertificateController@ApproveCert']);
                $router->post('certificate/roa/sample/lhu', ['as' => 'certificate.bulkUpdateSample', 'uses' => 'Analysis\CertificateController@bulkUpdateSample']);
                $router->post('certificate/sample/cert/approve-manager', ['as' => 'certificate.LHU.ApproveManager', 'uses' => 'Analysis\CertificateController@ApproveManager']);

                $router->post('certificate/lhu/cert/active', ['as' => 'certificate.LHU.ApproveManager', 'uses' => 'Analysis\CertificateController@activedcertificate']);
                $router->post('certificate/lhu/cert/getparameterinotherlhu', ['as' => 'certificate.LHU.ApproveManager', 'uses' => 'Analysis\CertificateController@getParameterinOtherLhu']);

                $router->post('certificate/sample/parameter/copy/data', ['as' => 'certificate.parameter.copyDataParameter', 'uses' => 'Analysis\CertificateController@copyDataParameter']);

                $router->post('certificate/draft', ['as' => 'certificate.draft', 'uses' => 'Analysis\CertificateController@draft']);
                $router->post('certificate/release', ['as' => 'certificate.release', 'uses' => 'Analysis\CertificateController@release']);
                $router->post('certificate/release-with-out-email', ['as' => 'certificate.releasewithoutemail', 'uses' => 'Analysis\CertificateController@releaseWithOutEmail']);
                $router->post('certificate/release-with-out-email/in-certificate', ['as' => 'certificate.releasewithoutemail', 'uses' => 'Analysis\CertificateController@releaseWithOutEmailinCertificate']);
                $router->post('certificate/resendemail', ['as' => 'certificate.resendEmail', 'uses' => 'Analysis\CertificateController@resendEmail']);

                $router->post('certificate/roa', ['as' => 'certificate.LHU.getCert', 'uses' => 'Analysis\CertificateController@resultofanalisys']);
                $router->get('certificate/roa/{id_contract}', ['as' => 'certificate.LHU.getCert', 'uses' => 'Analysis\CertificateController@showContractinRoa']);
                $router->post('certificate/roa/{id_contract}/contract', ['as' => 'certificate.LHU.getCert', 'uses' => 'Analysis\CertificateController@getRoainContract']);

                $router->post('certificate/archive', ['as' => 'certificate.lhu.archive', 'uses' => 'Analysis\CertificateController@archive']);
                $router->post('certificate/archive/{id_contract}', ['as' => 'certificate.lhu.archivedetail', 'uses' => 'Analysis\CertificateController@archiveDetail']);

                $router->post('certificate/archive/{id_contract}/change-condition', ['as' => 'certificate.change-condition', 'uses' => 'Analysis\CertificateController@changeCondition']);
                $router->post('certificate/archive/{id_contract}/change-condition/draft', ['as' => 'certificate.changeConditionDraft', 'uses' => 'Analysis\CertificateController@changeConditionDraft']);

                $router->get('certificate/get/team', ['as' => 'certificate.get-team', 'uses' => 'Analysis\ResultofAnalystController@getTeamCertificate']);
                $router->post('certificate/select-team', ['as' => 'certificate.select-team', 'uses' => 'Analysis\ResultofAnalystController@selectTeam']);

                $router->post('certificate/dataakg', ['as' => 'certificate.dataakg', 'uses' => 'Analysis\CertificateController@allAkgData']);
                $router->post('certificate/uploadakg', ['as' => 'certificate.uploadakg', 'uses' => 'Analysis\CertificateController@uploadAkg']);
                $router->post('certificate/deleteakg', ['as' => 'certificate.deleteakg', 'uses' => 'Analysis\CertificateController@deleteAkg']);
                $router->post('certificate/sendEmailAkg', ['as' => 'certificate.sendEmailAkg', 'uses' => 'Analysis\CertificateController@sendEmailAkg']);

                $router->post('certificate/upload-file', ['as' => 'certificate.uploadattachment', 'uses' => 'Analysis\CertificateController@uploadAttachmentRev']);
                $router->post('certificate/attachmentrevision', ['as' => 'certificate.uploadattachment', 'uses' => 'Analysis\CertificateController@attachmentData']);
                $router->post('certificate/revision-data', ['as' => 'certificate.uploadattachment', 'uses' => 'Analysis\CertificateController@revisionHistory']);
                $router->post('certificate/attachmentrevision/remove', ['as' => 'certificate.uploadattachment', 'uses' => 'Analysis\CertificateController@removeAttachment']);

                $router->post('certificate/{id_contract}/parameter/all', ['as' => 'certificate.getParameterAll', 'uses' => 'Analysis\CertificateController@getParameterAll']);
                $router->post('certificate/{id_contract}/parameter/update', ['as' => 'certificate.updateParameterAll', 'uses' => 'Analysis\CertificateController@updateParameterAll']);

                $router->post('certificate/parameter/update/lhu/bulk', ['as' => 'certificate.updateParameter', 'uses' => 'Analysis\CertificateController@updateParameter']);
                $router->post('certificate/data/parameter/delete-bulk/lhu/deleted', ['as' => 'certificate.deleteBUlkParameter', 'uses' => 'Analysis\CertificateController@deleteBUlkParameter']);
                $router->post('certificate/data/parameter/copy-data', ['as' => 'certificate.copyParameterinLhu', 'uses' => 'Analysis\CertificateController@copyParameterinLhu']);
                $router->post('certificate/data/parameter/delete-data', ['as' => 'certificate.deleteUnitParameter', 'uses' => 'Analysis\CertificateController@deleteUnitParameter']);


                $router->post('certificate/data/add/parameter/lhu/newparameter', ['as' => 'certificate.addParameterinLhu', 'uses' => 'Analysis\CertificateController@addParameterinLhu']);

                $router->post('certificate/data/get/parameter/lhu', ['as' => 'certificate.getcertinLHU', 'uses' => 'Analysis\CertificateController@getcertinLHU']);
                $router->post('certificate/data/add/listing-parameter/lhu', ['as' => 'certificate.addListingCertificate', 'uses' => 'Analysis\CertificateController@addListingCertificate']);


                $router->post('certificate/getparameter/inlab/{id}', ['as' => 'certificate.uploadattachment', 'uses' => 'Analysis\CertificateController@getParameterinLab']);

                $router->post('certificate/getparameter/hasbeen/detele/{id}', ['as' => 'certificate.uploadattachment', 'uses' => 'Analysis\CertificateController@getParameterHasBeenDelete']);

                $router->post('master/format', ['as' => 'certificate.get-format', 'uses' => 'Analysis\CertificateController@getFormat']);
                $router->get('master/getaddress/cert', ['as' => 'certificate.getListAddress', 'uses' => 'Analysis\CertificateController@getListAddress']);
                $router->get('contact-persons/cert', ['as' => 'certificate.contact-persons', 'uses' => 'Analysis\CertificateController@ContactPerson']);

                $router->post('certificate/track', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@track']);
                $router->post('certificate/track/change-team', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@changeSelectTeam']);

                $router->post('certificate/follow/data/data', ['as' => 'certificate.getDataFollow', 'uses' => 'Analysis\ResultofAnalystController@getDataFollow']);
                $router->post('certificate/follow/aprrove-data', ['as' => 'certificate.getDataFollow', 'uses' => 'Analysis\ResultofAnalystController@ApproveDataFollow']);

                $router->post('certificate/get-team-certificate', ['as' => 'certificate.getTeamCertificate', 'uses' => 'Analysis\ResultofAnalystController@getTeamCertificate']);

                $router->post('certificate/get-all-lhu', ['as' => 'certificate.getListLhu', 'uses' => 'Analysis\CertificateController@getListLhu']);

                // $router->get('certificate/get-draft/autosend',['as'=>'certificate.track','uses'=>'Analysis\CertificateController@getDraftforAuto']);
                // $router->get('certificate/get-draft/autosend/send',['as'=>'certificate.track','uses'=>'Analysis\CertificateController@autoSendDraft']);
                $router->post('certificate/get-draft/data-draft', ['as' => 'certificate.draftdata', 'uses' => 'Analysis\CertificateController@getDataForApp']);
                $router->post('certificate/get-draft/remove-data-draft', ['as' => 'certificate.draftdata', 'uses' => 'Analysis\CertificateController@removeAutosend']);

                $router->post('certificate/get-data-lhu/get-lhu/incontract', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@getLhuinContract']);

                $router->post('certificate/get-akg', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@GetAkg']);
                $router->post('certificate/get-contract', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@getKontrak']);
                $router->post('certificate/list-lhu/by-contract', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@getLhuInAkg']);
                $router->post('certificate/list-parameter/by-certificate', ['as' => 'certificate.track', 'uses' => 'Analysis\CertificateController@getParameterinLhu']);
                //end sertifikat
                //
                $router->patch('revision-add/{id}', 'Analysis\KontrakujiController@revision');
                $router->post('delete-parameter', 'Analysis\KontrakujiController@delete_trans_param');
                $router->patch('delete-parameter-contract/{id}', 'Analysis\KontrakujiController@deletetransparam');
                $router->post('contract-save', 'Analysis\KontrakujiController@kontrakSave');
                $router->get('get-cust-mou', 'Analysis\KontrakujiController@moucheck');
                $router->get('get-cust-mou-test', 'Analysis\KontrakujiController@mouchecktest');
                $router->get('photo-detail', 'Analysis\KontrakujiController@photoView');
                $router->post('photo-save', 'Analysis\KontrakujiController@addPhoto');
                $router->get('photo-delete', 'Analysis\KontrakujiController@photoDelete');
                $router->put('contract-update/{id}', 'Analysis\KontrakujiController@kontrakUpdate');
                $router->post('sample-save', 'Analysis\KontrakujiController@sampleSave');
                $router->post('sample-update', 'Analysis\KontrakujiController@sampleUpdate');
                $router->post('parameter-save', 'Analysis\KontrakujiController@parameterSave');
                $router->get('sample-get/{id}', 'Analysis\KontrakujiController@get_sample_from_contract');
                $router->get('get-message-contract', 'Analysis\KontrakujiController@getMessageContract');
                $router->post('pricing-save', 'Analysis\KontrakujiController@pricingSave');
                $router->post('pricing-update', 'Analysis\KontrakujiController@pricingUpdate');
                $router->get('transaction-sampling', 'Analysis\KontrakujiController@samplingdatatransaction');
                $router->get('transaction-akg', 'Analysis\KontrakujiController@akgdatatransaction');
                $router->post('send-attachment/{id}', 'Analysis\KontrakujiController@sendAttachment');
                $router->post('send-attachment-blob', 'Analysis\KontrakujiController@sendAttachmentBlob');
                $router->get('delete-attachment', 'Analysis\KontrakujiController@deleteattachment');
                $router->get('get-attachment/{id}', 'Analysis\KontrakujiController@getAttachment');
                $router->get('download-attachment', 'Analysis\KontrakujiController@downloadAttachment');
                $router->get('excel-parameter/{id}', 'Analysis\KontrakujiController@excelparameter');
                $router->get('get-tanggal-selesai', 'Analysis\KontrakujiController@gettglselesai');
                $router->get('view-edit-kontrak/{id}', 'Analysis\KontrakujiController@editview');
                $router->get('kontrakuji', ['as' => 'kontrakuji', 'uses' => 'Analysis\KontrakujiController@index']);
                $router->get('check-contract-lab', ['as' => 'kontrakuji', 'uses' => 'Analysis\KontrakujiController@checkcontractsamplelab']);
                $router->post('kontrakuji/light', ['as' => 'kontrakuji', 'uses' => 'Analysis\KontrakujiController@indexlight']);
                $router->get('kontrakuji/cekidot', ['as' => 'kontrakuji', 'uses' => 'Analysis\KontrakujiController@cekidot']);
                $router->get('allow-contract-rev', ['as' => 'kontrakuji', 'uses' => 'Analysis\KontrakujiController@allowContractRevision']);
                $router->post('kontrakuji/light-finder', ['as' => 'kontrakuji', 'uses' => 'Analysis\KontrakujiController@indexlightfinder']);
                $router->get('view-attachment/{id}', 'Analysis\KontrakujiController@view_attachment');
                $router->get('view-parameter', ['as' => 'kontrakuji', 'uses' => 'Analysis\LabController@exportParameter']);
                $router->get('kontrakuji/{id}', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@show']);
                $router->get('get-akg-data', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@get_data_akg_contract']);
                $router->get('get-sampling-data', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@get_data_sampling_contract']);
                $router->post('add-transaction-akg', 'Analysis\KontrakujiController@add_transaction_akg_contract');
                $router->patch('add-transaction-sampling/{id}', 'Analysis\KontrakujiController@add_transaction_sampling_contract');
                $router->delete('get-akg-data/{id}', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@delete_data_akg_contract']);
                $router->patch('kontrakuji-edit-data/{id}', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@edit_data_contract']);
                $router->get('edit-pic-contract', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@edit_pic_contract']);
                $router->get('kontrakuji-update/{id}', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@show_update']);
                $router->get('get-history-contract', ['as' => 'kontrakuji.view', 'uses' => 'Analysis\KontrakujiController@getMoreHistory']);
                $router->post('send-desc-contract', 'Analysis\KontrakujiController@setDescContract');
                $router->get('sample-param', 'Analysis\KontrakujiController@sample_param');
                $router->get('parameter-sample', 'Analysis\KontrakujiController@parameterpersample');
                $router->get('only-sample', 'Analysis\KontrakujiController@getSampleOnly');
                $router->get('downpayment-contract', 'Analysis\KontrakujiController@tambahdownpayment');
                $router->post('kontrakuji/add', ['uses' => 'Analysis\KontrakujiController@store']);
                $router->patch('kontrakuji/{id}', ['as' => 'kontrakuji.update', 'uses' => 'Analysis\KontrakujiController@update']);
                $router->delete('kontrakuji/{id}', ['as' => 'kontrakuji.delete', 'uses' => 'Analysis\KontrakujiController@destroy']);
                $router->get('getCustomersAddress', ['uses' => 'Analysis\KontrakujiController@getCustomersAddress']);
                $router->get('getCustomersTaxAddress', ['uses' => 'Analysis\KontrakujiController@getCustomersTaxAddress']);
                $router->get('getDataContactPerson', ['uses' => 'Analysis\KontrakujiController@getDataContactPerson']);
                $router->post('desc-add', 'Analysis\KontrakujiController@addDesc');
                $router->delete('desc-delete/{id}', 'Analysis\KontrakujiController@deleteDesc');
                $router->post('accepting-contract', 'Analysis\KontrakujiController@acceptContractNew');
                $router->get('check-attachment', 'Analysis\KontrakujiController@check_attachment');
                $router->get('check-contract-invoice', 'Analysis\KontrakujiController@checkinvoice');
                $router->get('condition-contract/{id}', 'Analysis\KontrakujiController@conditioncontractfind');
                $router->get('condition-contract/{id}/cert', 'Analysis\KontrakujiController@conditionCertStatus');
                $router->post('send-email-contract', 'Analysis\KontrakujiController@sendingemailcontract');
                $router->get('get-no-po', 'Analysis\KontrakujiController@getnopo');
                $router->get('get-no-penawaran', 'Analysis\KontrakujiController@getnopenawaran');

                $router->get('get-sample-photo/{id}', 'Analysis\KontrakujiController@samplephotocontract');
                $router->patch('update-sample-information/{id}', 'Analysis\KontrakujiController@sampleinformationedit');
                $router->post('condition-contract-det', 'Analysis\KontrakujiController@conditioncontractfindDetail');
                $router->get('information-contract-desc', 'Analysis\KontrakujiController@description');
                $router->post('send-contract-desc', 'Analysis\KontrakujiController@sendchat');
                $router->get('light-contract', 'Analysis\KontrakujiController@lightcontract');
                $router->get('user-contract', 'Analysis\KontrakujiController@getUserCreate');
                $router->get('get-price', 'Analysis\KontrakujiController@checkprice');
                $router->get('get-sample/{id}', 'Analysis\KontrakujiController@getSample');
                $router->get('get-sample-light/{id}', 'Analysis\KontrakujiController@sampleLight');
                $router->get('get-excel-sales', 'Analysis\KontrakujiController@excelForSales');
                $router->get('back-track-proximate', 'Analysis\KontrakujiController@back_track_proksimat');
                $router->get('acceptedcontractdisc', 'Analysis\KontrakujiController@acceptcontractdisc');
                // $router->post('contactpersons',['as'=>'contactperson','uses'=>'Analysis\ContactPersonController@index']);
                // $router->get('contactpersons',['as'=>'contactperson','uses'=>'Analysis\ContactPersonController@index']);
                // $router->get('contactpersons/{id}',['as'=>'contactperson.view','uses'=>'Analysis\ContactPersonController@show']);
                // $router->post('contactpersons/add',['uses'=>'Analysis\ContactPersonController@store']);
                // $router->patch('contactpersons/{id}',['as'=>'contactperson.update','uses'=>'Analysis\ContactPersonController@update']);
                // $router->delete('contactpersons/{id}',['as'=>'contactperson.delete','uses'=>'Analysis\ContactPersonController@destroy']);

                $router->get('customeraddress', ['as' => 'customeraddress', 'uses' => 'Analysis\CustomerAddressController@index']);
                $router->get('customeraddress/{id}', ['as' => 'customeraddress.view', 'uses' => 'Analysis\CustomerAddressController@show']);
                $router->post('customeraddress', ['uses' => 'Analysis\CustomerAddressController@store']);
                $router->patch('customeraddress/{id}', ['as' => 'customeraddress.update', 'uses' => 'Analysis\CustomerAddressController@update']);
                $router->delete('customeraddress/{id}', ['as' => 'customeraddress.delete', 'uses' => 'Analysis\CustomerAddressController@destroy']);
                $router->post('customeraddress/selected', ['as' => 'customeraddress', 'uses' => 'Analysis\CustomerAddressController@selectedAddress']);


                $router->get('customertaxaddress', ['as' => 'customertaxaddress', 'uses' => 'Analysis\CustomerTaxAddressController@index']);
                $router->get('customertaxaddress/{id}', ['as' => 'customertaxaddress.view', 'uses' => 'Analysis\CustomerTaxAddressController@show']);
                $router->post('customertaxaddress', ['uses' => 'Analysis\CustomerTaxAddressController@store']);
                $router->patch('customertaxaddress/{id}', ['as' => 'customertaxaddress.update', 'uses' => 'Analysis\CustomerTaxAddressController@update']);
                $router->delete('customertaxaddress/{id}', ['as' => 'customertaxaddress.delete', 'uses' => 'Analysis\CustomerTaxAddressController@destroy']);
                $router->post('testing', ['as' => 'customerhandle', 'uses' => 'Analysis\CustomershandleController@testing']);

                $router->post('get-customerhandle', ['as' => 'customerhandle', 'uses' => 'Analysis\CustomershandleController@index']);
                $router->get('customerhandle/{id}', ['as' => 'customerhandle', 'uses' => 'Analysis\CustomershandleController@show']);
                $router->put('customerhandle/{id}', ['as' => 'customerhandle', 'uses' => 'Analysis\CustomershandleController@update']);
                $router->post('customerhandle', ['uses' => 'Analysis\CustomershandleController@store']);
                $router->delete('customerhandle/{id}', ['as' => 'customerhandle', 'uses' => 'Analysis\CustomershandleController@destroy']);


                $router->group(['prefix' => 'complain'], function () use ($router) {
                    $router->post('cso', ['uses' => 'Complain\CsoController@index']);
                    $router->post('cso/download-data', ['uses' => 'Complain\CsoController@downloadData']);
                    $router->get('cso/{id}', ['uses' => 'Complain\CsoController@show']);
                    $router->post('cso/get-lhu', ['uses' => 'Complain\CsoController@getLHU']);
                    $router->get('get-parameter', ['uses' => 'Complain\CsoController@getParameter']);
                    $router->get('get-all-result', ['uses' => 'Complain\CsoController@getAllResult']);
                    $router->post('send-expectation', ['uses' => 'Complain\CsoController@sendExpectation']);
                    $router->get('get-data-parameter-tech/{id}', ['uses' => 'Complain\CsoController@getDataParameterChild']);
                    $router->post('get-data-excel-complain', ['uses' => 'Complain\ComplainTechnicalController@getDataExcelComplain']);
                    $router->post('get-data-parameter-complain', ['uses' => 'Complain\CsoController@getParameterLab']);
                    $router->get('get-data-parameter-by-complain', ['uses' => 'Complain\ComplainTechnicalController@getParamByComplain']);
                    $router->post('sending-data-complain', ['uses' => 'Complain\CsoController@savingdataparameter']);
                    $router->post('cancel-data-complain', ['uses' => 'Complain\CsoController@canceldatacomplain']);
                    $router->get('set-status-complain-det', ['uses' => 'Complain\CsoController@setStatusComplain']);
                    $router->get('change-est-date', ['uses' => 'Complain\ComplainTechnicalController@changestdate']);
                    $router->post('set-memo-complain-det', ['uses' => 'Complain\ComplainTechnicalController@setMemoComplainTechDet']);
                    $router->get('set-status-complain-techdet', ['uses' => 'Complain\CsoController@setstatustechnicaldetail']);
                    $router->post('cso/add-nonteknis', ['uses' => 'Complain\CsoController@addNonteknis']);
                    $router->post('nontechnical', ['uses' => 'Complain\NontechnicalController@index']);
                    $router->post('nontechnical/change-data', ['uses' => 'Complain\NontechnicalController@selectComplaint']);
                    $router->post('send-complain', ['uses' => 'Complain\CsoController@store']);
                    $router->get('export-data-complain', ['uses' => 'Complain\ComplainTechnicalController@exportdataComplain']);
                    $router->post('import-data-complain', ['uses' => 'Complain\ComplainTechnicalController@importdataComplain']);
                    $router->post('send-param-save', ['uses' => 'Complain\ComplainTechnicalController@sendsaveparam']);
                    $router->post('sending-complain-det-approve', ['uses' => 'Complain\ComplainTechnicalController@complainaprovelab']);
                    // $router->post('send-complain',['uses'=>'Complain\CsoController@store']); 
                    $router->patch('send-expectation/{id}', ['uses' => 'Complain\CsoController@sendExpectation']);
                    $router->post('cso/add', ['uses' => 'Complain\CsoController@addData']);
                    $router->post('cso/check-data', ['uses' => 'Complain\CsoController@checkDoubleAddData']);
                    $router->get('set-data-prep', ['uses' => 'Complain\CsoController@setDataPrep']);
                    $router->post('cso/deletecomplain/delete', ['uses' => 'Complain\CsoController@deleteComplaint']);
                    $router->post('cso/complain/{id_tech}', ['uses' => 'Complain\CsoController@showComplain']);
                    $router->post('cso/complain/detail/{id_tech}', ['uses' => 'Complain\CsoController@showComplainDetail']);
                    $router->post('cso/complain/detail/change/cancel-status', ['uses' => 'Complain\CsoController@cancelStatus']);
                    $router->post('cso/complain/detail/change/back-status', ['uses' => 'Complain\CsoController@backStatus']);
                    $router->post('cso/complain/detail/priview/technical/add-parameter', ['uses' => 'Complain\CsoController@addParameterinCso']);
                    $router->post('cso/complain/detail/priview/technical/delete-parameter', ['uses' => 'Complain\CsoController@deleteParameterTechComplain']);


                    $router->post('get-complain-technical', ['uses' => 'Complain\ComplainTechnicalController@index']);
                    $router->post('sending-cert', ['uses' => 'Complain\ComplainTechnicalController@sendingCert']);

                    $router->post('preparation-complain', ['uses' => 'Complain\PreparationComplaintController@index']);
                    $router->post('preparation-complain/approve', ['uses' => 'Complain\PreparationComplaintController@approveSample']);
                    $router->post('preparation-complain/set-status/prep', ['uses' => 'Complain\PreparationComplaintController@statusPrep']);

                    $router->post('preparation-complain/history/download', ['uses' => 'Complain\PreparationComplaintController@exportDataHistory']);

                    $router->post('certificate-complain', ['uses' => 'Complain\CertificateComplainController@index']);
                    $router->post('certificate-complain/approve', ['uses' => 'Complain\CertificateComplainController@approve']);
                    $router->post('certificate-complain/details', ['uses' => 'Complain\CertificateComplainController@details']);
                    $router->post('certificate-complain/before/details', ['uses' => 'Complain\CertificateComplainController@detailCertificate']);
                    $router->post('certificate-complain/update/data', ['uses' => 'Complain\CertificateComplainController@updateDataDetail']);
                });

                $router->group(['prefix' => 'ecert'], function () use ($router) {
                    $router->get('certificate/{id_kontrak}', ['uses' => 'Ecert\EcertCertificateController@detailKontrak']);
                    $router->post('certificate', ['uses' => 'Ecert\EcertCertificateController@certificate']);
                    $router->post('certificate/{id}', ['uses' => 'Ecert\EcertCertificateController@certificateDetail']);

                    $router->post('complain', ['uses' => 'Ecert\EcertCertificateController@complain']);
                    $router->post('complain/get-lhu', ['uses' => 'Ecert\EcertCertificateController@lhuComplain']);
                    $router->post('complain/addcomplain', ['uses' => 'Ecert\EcertCertificateController@addComplainEmail']);

                    $router->post('release', ['uses' => 'Ecert\EcertCertificateController@release']);

                    $router->post('invoice', ['uses' => 'Ecert\EcertInvoiceController@invoice']);
                    $router->get('invoice/{id_kontrakuji}', ['uses' => 'Ecert\EcertInvoiceController@invoiceByContract']);

                    $router->post('contract', ['uses' => 'Ecert\EcertContractController@contract']);
                    $router->get('contract/{id_kontrakuji}', ['uses' => 'Ecert\EcertContractController@contractDetail']);
                    $router->get('contract/check-condition/{id_kontrakuji}', ['uses' => 'Ecert\EcertContractController@checkCondition']);

                    $router->get('sample/{id_kontrak}', ['uses' => 'Ecert\EcertSampleController@detailKontrak']);
                    $router->post('sample/{id_kontrak}', ['uses' => 'Ecert\EcertSampleController@sample']);

                    $router->post('dashboard', ['uses' => 'Ecert\EcertDashboardController@dashboard']);
                    $router->post('dashboard/running-data', ['uses' => 'Ecert\EcertDashboardController@runningData']);
                    $router->post('dashboard/billpayments/list', ['uses' => 'Ecert\EcertDashboardController@listBillPayments']);
                });
            });

            $router->group(['prefix' => 'edoc'], function () use ($router) {
                $router->post('master-document', ['uses' => 'Edoc\Masterdocumentcontroller@basicdocument']);
                $router->post('master-document/inheritance', ['uses' => 'Edoc\Masterdocumentcontroller@basicInheritancedocument']);

                $router->post('send-attactment', ['uses' => 'Edoc\DocumentsController@StoreFileDocuments']);
                $router->post('documents/store', ['uses' => 'Edoc\DocumentsController@storeNewDocuments']);
                $router->post('documents/get-data', ['uses' => 'Edoc\DocumentsController@getDataDocuments']);
                $router->post('documents/get-data/details', ['uses' => 'Edoc\DocumentsController@getDataDetailDocuments']);
                $router->post('documents/get-data/details/update-data', ['uses' => 'Edoc\DocumentsController@editDocument']);

                $router->post('documents/list-amandement', ['uses' => 'Edoc\DocumentsController@listAmandement']);
                $router->post('documents/attachment/detail', ['uses' => 'Edoc\DocumentsController@AttachmentDetail']);
                $router->post('documents/all-list/set-active', ['uses' => 'Edoc\DocumentsController@setActive']);
                $router->post('documents/all-list/update-list', ['uses' => 'Edoc\DocumentsController@updateAttachment']);
                $router->post('documents/all-list/viewed-document', ['uses' => 'Edoc\DocumentsController@viewedDocument']);
                $router->post('documents/all-list/viewed-document/get-view', ['uses' => 'Edoc\DocumentsController@geviewedDocuments']);

                $router->post('attachment-delete', ['uses' => 'Edoc\DocumentsController@removeFile']);

                $router->post('send-attactment/new-add', ['uses' => 'Edoc\DocumentsController@StoreFileAddDocuments']);
                $router->post('other-documents/add-new-doc', ['uses' => 'Edoc\DocumentsController@storeDataDocuments']);

                $router->post('other-documents/delete-document', ['uses' => 'Edoc\DocumentsController@deleteAttachment']);

                $router->get('documents/create/document/list', ['uses' => 'Edoc\DocumentsController@createDirectory']);


                $router->group(['prefix' => 'groups'], function () use ($router) {
                    $router->post('/', ['uses' => 'Edoc\GroupsController@index']);
                    $router->post('/detail', ['uses' => 'Edoc\GroupsController@groupDetail']);
                    $router->post('/add-user', ['uses' => 'Edoc\GroupsController@AddEmployeetoGroup']);
                    $router->post('/remove-user', ['uses' => 'Edoc\GroupsController@DeleteEmployeeinGroup']);
                    $router->post('detail/get-employee', ['uses' => 'Edoc\GroupsController@groupDetailEmployee']);
                    $router->post('add-new', ['uses' => 'Edoc\GroupsController@addNewGroup']);
                    $router->post('get-employee', ['uses' => 'Edoc\GroupsController@employeeData']);
                });

                $router->group(['prefix' => 'access'], function () use ($router) {
                    $router->post('/get-employee-access', ['uses' => 'Edoc\DocumentsController@accessDocuments']);
                    $router->post('/get-employee-all', ['uses' => 'Edoc\DocumentsController@employeeData']);
                    $router->post('/add-new-user', ['uses' => 'Edoc\DocumentsController@addUserToAccess']);
                    $router->post('/delete-user', ['uses' => 'Edoc\DocumentsController@deleteUserToAccess']);
                    $router->post('/group/add-user-by-group', ['uses' => 'Edoc\DocumentsController@addAccessByGroup']);
                });
            });
        });
    }
);
