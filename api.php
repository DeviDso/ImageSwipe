<?php

    $method = $_SERVER['REQUEST_METHOD'];

    if($method == 'GET')
    {
        $images = [
            ['id' => 1, 'url' => 'img/perfect.jpg'],
            ['id' => 2, 'url' => 'img/afterparty2.jpg']
        ];
        echo json_encode($images);
    }

    if($method == 'POST')
    {
        $_POST = json_decode(file_get_contents('php://input'), true);
        $file = fopen('ratings.json', 'r+');
        $data = $_POST;
        $temp = file_get_contents('ratings.json');
        $tempData = json_decode($temp);
        unset($temp);
        $tempData[] = $data;
        $json = json_encode($tempData);
        fwrite($file, $json);
        fclose($file);

        return true;
    }

?>
