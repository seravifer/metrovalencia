$(document).ready(function() {
    $("#main").dragend({
        disabled : true
    });
    $('#selectOrigen option[value="' + localStorage.getItem("cookieOrigen") + '"]').prop('selected', true);
    $('#selectDestination option[value="' + localStorage.getItem('cookieDestination') + '"]').prop('selected', true);
    $('#date').val(getDay());
    $('#hora').val(getTime());

    
    $('#selectOrigen').change(function() {
        localStorage.setItem("cookieOrigen", $(this).val());
    });

    $('#selectDestination').change(function() {
        localStorage.setItem("cookieDestination",  $(this).val());
    });
    
    $('#invert').click(function() {
        var aux = $('#selectOrigen').val();
        $('#selectOrigen').val($('#selectDestination option:selected').val());
        $('#selectDestination').val(aux);
        
        localStorage.setItem("cookieDestination",  $('#selectDestination').val());
        localStorage.setItem("cookieOrigen", $('#selectOrigen').val());
    })

    $('#form').submit(function(event) {

        var formData = {
            'origen'    : $('#selectOrigen').val(),
            'res'       : 0,
            'key'       : 0,
            'destino'   : $('#selectDestination').val(),
            'fecha'     : $('input[name=date]').val(),
            'hini'      : $('input[name=hora]').val(),
            'hfin'      : '23:59',
            'calcular'  : 1
        };

        $.ajax({
            
            url        : 'https://cors.now.sh/http://www.metrovalencia.es/horarios.mobi.php',
            type        : 'GET',
            data        : formData,
            encode      : true
            
        }).done(function(data) {
            
            parseData(data);
            $("#main").dragend({
                scrollToPage : 2,
                disabled : false
            });

            //window.location.href = "#schedule";
        }).fail(function() {
            alert("Algo ha fallado");
        })
        
        event.preventDefault();
        
    });
    
    function parseData(data) {
        var table = $(data).find('table');
        var info = $(data).find('li');
        $('#info').append(info.eq(4).text().substring(34, 50));
        $('#info').append('<br>Zona: ' + info.eq(5).text().substring(66, 69));

        table.find('tr').each(function (i, row) {
            $(this).find('td').each(function(j, cell) {
                if (j != 0 && cell.innerHTML != "---") {
                    $('#timetable').append('<div class="time">Salida a las ' + cell.innerHTML + 'h dentro de ' + timeLeft(cell.innerHTML) + '</div>');
                    //console.log(cell.innerHTML);
                }
            });
        });
    }

    function timeLeft(nextTime) {
        var date = new Date();
        var actualHour = (date.getHours() < 10 ? '0' : '') + date.getHours();
        var actualMin = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        var nextHour = nextTime.substring(0,2);
        var nextMin = nextTime.substring(3,5);

        var total = ((nextHour * 60) + nextMin) - ((actualHour * 60) + actualMin);

        return (total / 60 / 100 | 0) + ':' + (total % 60 < 10 ? '0' : '') + total % 60;
    }

    function getDay() {
        var today = new Date();
        var dd = (today.getDate() < 10 ? '0' : '') + today.getDate();
        var mm = ((today.getMonth() + 1) < 10 ? '0' : '') + (+today.getMonth() + +1); // January is 0
        var yyyy = today.getFullYear();

        return dd + '/' + mm + '/' + yyyy;
    }

    function getTime() {
        var date = new Date();
        var hh = (date.getHours() < 10 ? '0' : '') + date.getHours();
        var mm = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

        return hh + ':' + mm;
    }

});