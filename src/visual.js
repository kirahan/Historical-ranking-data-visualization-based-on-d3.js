/**
 * @author Jannchie
 * @email jannchie@gmail.com
 * @create date 2018-05-02 13:17:10
 * @modify date 2018-07-21 09:53:45
 * @desc 可视化核心代码
 */
import * as d3 from 'd3';
require("./stylesheet.css");
require("../dist/color.css");
$('#inputfile').change(function () {
    $('#inputfile').attr('hidden', true);
    var r = new FileReader();
    r.readAsText(this.files[0], config.encoding);
    r.onload = function () {
        //读取完成后，数据保存在对象的result属性中
        var data = d3.csvParse(this.result);
        draw(data);
    }
});

function draw(data) {
    var color = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
        "U", "V", "W", "X", "Y", "Z"
    ];
    var date = [];
    data.forEach(element => {
        if (date.indexOf(element["date"]) == -1) {
            date.push(element["date"]);
        }
    });
    var auto_sort = config.auto_sort;
    if (auto_sort) {
        var time = date.sort();
    } else {
        var time = date;
    }

    var use_custom_color = config.use_custom_color;
    var divide_by_type = config.divide_by_type;
    // 选择颜色
    function getClass(d) {
        // 不随机选色
        if (d.type != '' && d.type != undefined) {
            if (use_custom_color) {
                if (use_type_info == false) {
                    return d.name
                }
                return d.type;
            }
        }

        // 随机选色
        var r = 0;
        if (use_type_info) {
            if (divide_by_type){
                for (let index = 0; index < d.type.length; index++) {
                    r = r + d.type.charCodeAt(index);
                }
            }else{
                for (let index = 0; index < d.name.length; index++) {
                    r = r + d.name.charCodeAt(index);
                }
            }
        } else {
            for (let index = 0; index < d.name.length; index++) {
                r = r + d.name.charCodeAt(index);
            }
        }
        r = r % 25;
        r = Math.round(r);
        return color[r];
    }
    var showMessage = config.showMessage;
    var showRightDetail = config.showRightDetail;
    var dividing_line = config.dividing_line;
    var interval_time = config.interval_time;
    var text_y = config.text_y;
    var itemLabel = config.itemLabel;
    var typeLabel = config.typeLabel;
    // 长度小于display_barInfo的bar将不显示barInfo
    var display_barInfo = config.display_barInfo;
    //排序类型
    var sort_type = config.descending_sort;
    // 显示类型
    var use_type_info = config.use_type_info;
    // 使用计数器
    var use_counter = config.use_counter;
    // 每个数据的间隔日期
    var step = config.step;
    var format = config.format
    var left_margin = config.left_margin;
    var right_margin = config.right_margin;
    var top_margin = config.top_margin;
    var bottom_margin = config.bottom_margin;
    var dateLabel_x = config.dateLabel_x;
    var dateLabel_y = config.dateLabel_y;
    var item_x = config.item_x;
    var max_number = config.max_number;
    var Xviewvalue = config.xScale;
    const margin = {
        left: left_margin,
        right: right_margin,
        top: top_margin,
        bottom: bottom_margin
    };

    var enter_from_0 = config.enter_from_0;
    interval_time /= 3;

    var currentdate = time[0].toString();
    var currentData = [];
    var lastname;
    const svg = d3.select('svg');
    const width = svg.attr('width');
    const height = svg.attr('height');
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - 50;

    const xValue = d => Number(d.value);
    const yValue = d => d.name;
    const tDetail = d => d.detail;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    const xAxisG = g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`);
    const yAxisG = g.append('g');

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', 100);

    // const xScale = d3.scalePow().exponent(.5);
    const xScale = d3.scaleLinear()
    const yScale = d3.scaleBand()
        .paddingInner(0.3)
        .paddingOuter(0);

    const xTicks = 10;
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(xTicks)
        .tickPadding(20)
        .tickFormat(d => d)
        .tickSize(-innerHeight);

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickPadding(5)
        .tickSize(-innerWidth);

    var dateLabel = g.insert("text")
        .data(currentdate)
        .attr("class", "dateLabel")
        .attr("x", dateLabel_x)
        .attr("y", dateLabel_y)
        .text(currentdate);

    var topLabel = g.insert("text")
        .attr("class", "topLabel")
        .attr("x", item_x)
        .attr("y", text_y)

    function getCurrentData(date) {
        currentData = [];
        data.forEach(element => {
            if (element["date"] == date) {
                currentData.push(element);
            }
        });
        var tempSort = []

        //sort type  change by kira

        var currentSort
        if(sort_type){
            currentSort = currentData.sort(function (a, b) {
                return Number(b.value) - Number(a.value);
            });
        }
        else{
            currentSort = currentData.sort(function (a, b) {
                return Number(a.value) - Number(b.value);
            });

        }

        currentData = currentData.slice(0, max_number);

        var a = d3.transition("2")
            .each(redraw)
        if (currentSort != tempSort) {
            a.each(change)
        }
        tempSort = currentSort;
    }

    if (showMessage) {

        // 左1文字
        g.insert("text")
            .attr("class", "growth")
            .attr("x", 0)
            .attr("y", text_y).text(itemLabel);

        // 右1文字
        g.insert("text")
            .attr("class", "growth")
            .attr("x", 1000)
            .attr("y", text_y).text(typeLabel);
        // 榜首日期计数
        if (use_counter == true) {
            var days = g.insert("text")
                .attr("class", "days")
                .attr("x", 1300)
                .attr("y", text_y);
        } else {
            // 显示榜首type
            if (use_type_info == true) {
                var top_type = g.insert("text")
                    .attr("class", "days")
                    .attr("x", 1300)
                    .attr("y", text_y);
            }
        }
    }

    var lastname;
    var counter = {
        "value": 1
    };


    function redraw() {
        yScale
            .domain(currentData.map(yValue).reverse())
            .range([innerHeight, 0]);
        // x轴范围
        // xScale.domain([2 * d3.min(currentData, xValue) - d3.max(currentData, xValue), d3.max(currentData, xValue) + 100]).range([0, innerWidth]);
        xScale.domain([0, d3.max(currentData, xValue) + 100]).range([0, innerWidth*Xviewvalue]);

        // 日期格式 仅仅显示月份
        dateLabel.text(function () {
            var format = String(currentdate).split('-')[0] + '-' + String(currentdate).split('-')[1];
            return format
        });

        xAxisG.transition(g).duration(3000 * interval_time).ease(d3.easeLinear).call(xAxis);
        yAxisG.transition(g).duration(3000 * interval_time).ease(d3.easeLinear).call(yAxis);

        yAxisG.selectAll('.tick').remove();

        var bar = g.selectAll(".bar")
            .data(currentData, function (d) {
                return d.name;
            });
        var nameformatUP = config.nameformatUP
        var resultformatUPFlag = config.resultformatUPFlag
        var rubikTimeFormat = function (time) {
            time = Number(time)
            if(time>0){
                if(time<6000){
                    var secPart = Math.floor((time%6000)/100)
                    var deciPart = time%100
                    if(secPart==0){
                        secPart = '0'
                    }
                    if(deciPart==0){
                        deciPart = '00'
                    }
                    else if(deciPart<10){
                        deciPart = '0' + String(deciPart)
                    }

                    return [secPart,deciPart]
                }else{
                    var minPart = String(Math.floor(time/6000))
                    var secPart = Math.floor((time%6000)/100)
                    var deciPart = time%100

                    if(secPart==0){
                        secPart = '00'
                    }
                    else if(secPart<10){
                        secPart = '0' + String(secPart)
                    }

                    if(deciPart==0){
                        deciPart = '00'
                    }
                    else if(deciPart<10){
                        deciPart = '0' + String(deciPart)
                    }
                    return [minPart,secPart,deciPart]
                }
            }
            else if(time==-1){
                return 'DNF'
            }else{
                return 'Unknown'
            }
        }
        var rubikTimeFormat2String = function (time) {
            time = Number(time)
            if(time>0){
                if(time<6000){
                    var secPart = Math.floor((time%6000)/100)
                    var deciPart = time%100
                    if(secPart==0){
                        secPart = '0'
                    }
                    if(deciPart==0){
                        deciPart = '00'
                    }
                    else if(deciPart<10){
                        deciPart = '0' + String(deciPart)
                    }

                    return secPart + '.'+ deciPart
                }else{
                    var minPart = String(Math.floor(time/6000))
                    var secPart = Math.floor((time%6000)/100)
                    var deciPart = time%100

                    if(secPart==0){
                        secPart = '00'
                    }
                    else if(secPart<10){
                        secPart = '0' + String(secPart)
                    }

                    if(deciPart==0){
                        deciPart = '00'
                    }
                    else if(deciPart<10){
                        deciPart = '0' + String(deciPart)
                    }
                    return minPart + ':'+ secPart + '.'+ deciPart
                }
            }
            else if(time==-1){
                return 'DNF'
            }else{
                return 'Unknown'
            }
        }
        if (showMessage) {
            // 榜首文字
            topLabel.data(currentData).text(function (d) {
                if (lastname == d.name) {
                    counter.value = counter.value + step;
                } else {
                    counter.value = 1;
                }
                lastname = d.name
                // 修改 名称格式
                if(nameformatUP == 'Region'){
                    if(d.name.split('(').length==2){
                        return d.name.split('(')[1].split(')')[0]
                    }else{
                        return d.name
                    }
                }
                else if(nameformatUP == 'English'){
                    if(d.name.split('(').length==2){
                        return d.name.split('(')[0]
                    }else{
                        return d.name
                    }
                }
                else{
                    return d.name
                }


            });
            if (use_counter == true) {
                // 榜首持续时间更新
                days.data(currentData).transition().duration(3000 * interval_time).ease(d3.easeLinear).tween(
                    "text",
                    function (d) {
                        var self = this;
                        var i = d3.interpolate(self.textContent, counter.value),
                            prec = (counter.value + "").split("."),
                            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                        return function (t) {
                            self.textContent = d3.format(format)(Math.round(i(t) * round) / round);
                        };
                    });
            }
            if (use_type_info == true) {
                // 榜首type更新
                top_type.data(currentData).text(function (d) {
                    if(resultformatUPFlag){
                        if(rubikTimeFormat(d.value)){
                            var timetext = rubikTimeFormat(d.value)
                            if(timetext.length==2){
                                return timetext[0] + '.' + timetext[1]
                            }
                            else if(timetext.length == 3){
                                return timetext[0] + ':' + timetext[1] + '.' + timetext[2]
                            }
                        }
                        else {
                            return d.value
                        }
                    }else{
                        return d.value
                    }

                });
            }
        }

        var barEnter = bar.enter().insert("g", ".axis")
            .attr("class", "bar")
            .attr("transform", function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            });
        barEnter.append("g").attr("class", function (d) {
            return getClass(d)
        })

        barEnter.append("rect").attr("width",
                function (d) {
                    if (enter_from_0) {
                        return 0;
                    } else {
                        return xScale(xValue(d));
                    }
                }).attr("fill-opacity", 0)
            .attr("height", 26).attr("y", 50)
            .transition("a")
            .attr("class", d => getClass(d))
            .delay(500 * interval_time)
            .duration(2490 * interval_time)
            .attr("y", 0).attr(
                "width", d =>
                xScale(xValue(d)))
            .attr("fill-opacity", 1);


        barEnter.append("text").attr("y", 50).attr("fill-opacity", 0).transition("2").delay(500 * interval_time).duration(
                2490 * interval_time)
            .attr(
                "fill-opacity", 1).attr("y", 0)
            .attr("class", function (d) {
                return "label " + getClass(d)
            })
            .attr("x", -5)
            .attr("y", 20)
            .attr("text-anchor", "end")
            .text(function (d) {
                return d.name;
            });

        //detail
        if(showRightDetail){
            barEnter.append("text").attr("x",function () {
                return config.detail_x_margin;
            }).attr("y",50).attr("fill-opacity",0).transition("2").delay(500*interval_time).duration(2490*interval_time)
                .attr(
                    "fill-opacity", 1).attr("y", 0)
                .attr("class", function (d) {
                    return "detaillabel " + getClass(d)
                })
                .attr("y", 40)
                .attr("text-anchor", "start")
                .text(function (d) {
                    var detail = d.detail.split('[')[1].split(']')[0].split('#')
                    var detailString = '详情:\t'
                    for(var value of detail){
                        detailString += rubikTimeFormat2String(value) + '\t'
                    }
                    return detailString
                });
        }


        var barRightResultFormatFlag = config.barRightResultFormatFlag
        //右侧显示文字  初始化
        barEnter.append("text").attr("x",
                function (d) {
                    if (enter_from_0) {
                        return 0;
                    } else {
                        return xScale(xValue(d));
                    }
                }).attr("y", 50).attr("fill-opacity", 0).transition()
            .delay(500 * interval_time).duration(2490 * interval_time).tween(
                "text",
                function (d) {
                    var self = this;
                    var i
                    var i_array = []

                    if(barRightResultFormatFlag){
                        var data = rubikTimeFormat(d.value)
                        if(data.length==3){
                            i_array[0] = d3.interpolate(0,data[0] );
                            i_array[1] = d3.interpolate(0,data[1] );
                            i_array[2] = d3.interpolate(0,data[2] );
                            return function (t) {
                                var secPart = Number(d3.format('.0f')(i_array[1](t)))
                                var deciPart = Number(d3.format('.0f')(i_array[2](t)))
                                if(secPart==0){
                                    secPart = '00'
                                }
                                else if(secPart<10){
                                    secPart = '0' + String(secPart)
                                }

                                if(deciPart==0){
                                    deciPart = '00'
                                }
                                else if(deciPart<10){
                                    deciPart = '0' + String(deciPart)
                                }
                                self.textContent = d3.format('.0f')(i_array[0](t)) + ':'+ String(secPart) + '.' +  String(deciPart);    //
                            };
                        }else if(data.length==2){
                            i_array[0] = d3.interpolate(0,data[0] );
                            i_array[1] = d3.interpolate(0,data[1] );
                            return function (t) {
                                var deciPart = Number(d3.format('.0f')(i_array[1](t)))

                                if(deciPart==0){
                                    deciPart = '00'
                                }
                                else if(deciPart<10){
                                    deciPart = '0' + String(deciPart)
                                }
                                self.textContent = d3.format('.0f')(i_array[0](t)) + '.'+ String(deciPart);
                            };
                        }

                    }
                    else{
                        console.warn('in update')
                        i = d3.interpolate((self.textContent), Number(d.value))
                        return function (t) {
                            self.textContent = d3.format(format)(i(t));
                        };
                    }
                }).attr(
                "fill-opacity", 1).attr("y", 0)
            .attr("class", function (d) {
                return "value " + getClass(d)
            }).attr("x", d => xScale(xValue(d)) + 10)
            .attr("y", 22);

        // bar上文字
        barEnter.append("text").attr("x",
                function (d) {
                    if (enter_from_0) {
                        return 0;
                    } else {
                        return xScale(xValue(d));
                    }
                })
            .attr("stroke", function (d) {
                return $("." + getClass(d)).css("fill");
            })
            .attr("class", function (d) {
                return "barInfo"
            })
            .attr("y", 50).attr("stroke-width", "0px").attr("fill-opacity",
                0).transition()
            .delay(500 * interval_time).duration(2490 * interval_time).text(
                function (d) {
                    if (use_type_info) {
                        return d.type + "-" + d.name;
                    }
                    return d.name;
                }).attr("x", d => xScale(xValue(d)) - 10).attr(
                "fill-opacity",
                function (d) {
                    if (xScale(xValue(d)) - 10 < display_barInfo) {
                        return 0;
                    }
                    return 1;
                })
            .attr("y", 2)
            .attr("dy", ".5em")
            .attr("text-anchor", "end")
            .attr("stroke-width", function (d) {
                if (xScale(xValue(d)) - 10 < display_barInfo) {
                    return "0px";
                }
                return "1px";
            });

        //.attr("text-anchor", "end").text(d => GDPFormater(Number(d.value) ));
        var barUpdate = bar.transition("2").duration(2990 * interval_time).ease(d3.easeLinear);

        barUpdate.select("rect")
            .attr("width", d => xScale(xValue(d)))
        barUpdate.select(".barInfo").attr("x", d => xScale(xValue(d)) - 10).attr(
            "fill-opacity",
            function (d) {
                if (xScale(xValue(d)) - 10 < display_barInfo) {
                    return 0;
                }
                return 1;
            }
        ).attr("stroke-width", function (d) {
            if (xScale(xValue(d)) - 10 < display_barInfo) {
                return "0px";
            }
            return "1px";
        })

        //右侧显示文字  刷新
        //
        barUpdate.select(".value").tween("text", function (d) {
            var self = this;
            var i
            var i_array = []

            if(barRightResultFormatFlag){
                var data = rubikTimeFormat(d.value)
                if(data.length==3){
                    i_array[0] = d3.interpolate(self.textContent.split(':')[0],data[0] );
                    i_array[1] = d3.interpolate(self.textContent.split(':')[1].split('.')[0],data[1] );
                    i_array[2] = d3.interpolate(self.textContent.split(':')[1].split('.')[1],data[2] );
                    return function (t) {
                        var secPart = Number(d3.format('.0f')(i_array[1](t)))
                        var deciPart = Number(d3.format('.0f')(i_array[2](t)))
                        if(secPart==0){
                            secPart = '00'
                        }
                        else if(secPart<10){
                            secPart = '0' + String(secPart)
                        }

                        if(deciPart==0){
                            deciPart = '00'
                        }
                        else if(deciPart<10){
                            deciPart = '0' + String(deciPart)
                        }
                        self.textContent = d3.format('.0f')(i_array[0](t)) + ':'+ String(secPart) + '.' +  String(deciPart);    //
                    };
                }else if(data.length==2){
                    if(self.textContent.split(':').length==2){
                        i_array[0] = d3.interpolate(0,data[0] );
                        i_array[1] = d3.interpolate(0,data[1] );
                    }
                    else{
                        i_array[0] = d3.interpolate(self.textContent.split('.')[0],data[0] );
                        i_array[1] = d3.interpolate(self.textContent.split('.')[1],data[1] );
                    }
                    return function (t) {
                        var deciPart = Number(d3.format('.0f')(i_array[1](t)))

                        if(deciPart==0){
                            deciPart = '00'
                        }
                        else if(deciPart<10){
                            deciPart = '0' + String(deciPart)
                        }
                        self.textContent = d3.format('.0f')(i_array[0](t)) + '.'+ String(deciPart);
                    };
                }

            }
            else{
                console.warn('in update')
                i = d3.interpolate((self.textContent), Number(d.value))
                return function (t) {
                    self.textContent = d3.format(format)(i(t));
                };
            }

        }).duration(2990 * interval_time).attr("x", d => xScale(xValue(d)) + 10)

        //detail 文字刷新
        if(showRightDetail){
            barUpdate.select(".detaillabel").text(function (d) {
                var detail = d.detail.split('[')[1].split(']')[0].split('#')
                var detailString = '详情:\t'
                for(var value of detail){
                    detailString += rubikTimeFormat2String(value) + '\t'
                }
                return detailString
            });
        }

        var barExit = bar.exit().attr("fill-opacity", 1).transition().duration(2500 * interval_time)

        barExit.attr("transform", function (d) {
                var temp = parseInt(this.attributes["transform"].value.substr(12, 4))
                if (temp < dividing_line) {
                    return "translate(0," + temp - 5 + ")";
                }
                return "translate(0," + 780 + ")";
            })
            .remove().attr("fill-opacity", 0);
        barExit.select("rect").attr("fill-opacity", 0)
        barExit.select(".value").attr("fill-opacity", 0)
        barExit.select(".barInfo").attr("fill-opacity", 0).attr("stroke-width", function (d) {
            return "0px";
        })
        barExit.select(".barInfo2").attr("fill-opacity", 0).attr("stroke-width", function (d) {
            return "0px";
        })
        barExit.select(".label").attr("fill-opacity", 0)

    }

    function change() {
        var bar = g.selectAll(".bar")
            .data(currentData, function (d) {
                return d.name;
            });
        var barUpdate = bar.transition("1").delay(500 * interval_time).duration(2490 * interval_time)
        if (barUpdate.attr("transform") != "translate(0," + function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            }) {
            barUpdate.attr("transform", function (d) {
                return "translate(0," + yScale(yValue(d)) + ")";
            })
        }

    }

    getCurrentData(time[0]);

    var i = 1;
    var inter = setInterval(function next() {
        currentdate = time[i];
        getCurrentData(time[i]);
        i++;
        if (i >= time.length) {
            window.clearInterval(inter);
        }
    }, 3000 * interval_time);
}