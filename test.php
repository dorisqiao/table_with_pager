<?php
    /*以XML格式向客户端返回更多的菜品数据*/
    header('Content-Type:application/json');
    $output=[];
    for($i=0; $i <= 200; $i++){
        array_push(
            $output,
            [
                'col1'=>rand(1,200),
                'col2'=>rand(20,100),
                'col3'=>rand(10,180),
                'col4'=>rand(2,199),
                'col5'=>rand(7,186)
            ]
        );
    }

    echo json_encode($output);
?>

