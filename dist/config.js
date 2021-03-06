const config = {
    // 编码方式,默认为GBK,按需可修改为UTF-8等。
    encoding:"UTF-8",

    // 每日最多显示的条目数
    max_number : 20,

    // 显示顶部附加信息
    showMessage : true,

    // 时间自动排序（基于字符串）
    auto_sort : false,

    // 使用自定义的颜色，需要手动填写color.css这个文件
    // 如果为false，则随机配色
    use_custom_color : false,

    // 附加信息内容
    itemLabel : "榜首视频作者",
    typeLabel : "视频分区",
    item_x : 400,

    // 时间点间隔时间
    interval_time : 1,

    // 文字水平高度
    text_y : -50,

    // 长度小于display_barInfo的bar将不显示barInfo
    display_barInfo : 1400,

    // 类型显示 
    use_type_info : true,

    // 使用计数器
    use_counter : false,
    // 每个数据的间隔日期
    step : 7,

    // 格式化数值
    format : '.0f',

    // 图表左右上下间距
    left_margin : 230,
    right_margin : 150,
    top_margin : 200,
    bottom_margin : 0,

    // 时间标签坐标
    dateLabel_x : 860,
    dateLabel_y : 750,
    
    // 消失分界线：区分柱子消失时是上浮还是下浮，0为全部下浮
    dividing_line : 0,
    
    enter_from_0: false,
}