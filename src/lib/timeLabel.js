Date.prototype.format = function(fmt) { 
	var o = { 
		 "M+" : this.getMonth()+1,                 //月份 
		 "d+" : this.getDate(),                    //日 
		 "h+" : this.getHours(),                   //小时 
		 "m+" : this.getMinutes(),                 //分 
		 "s+" : this.getSeconds(),                 //秒 
		 "aa+" : Math.floor((this.getMonth()+3)/3), //季度 
		 "S"  : this.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
				 fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
	for(var k in o) {
		 if(new RegExp("("+ k +")").test(fmt)){
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
	}
 return fmt; 
} 

const timeLabel = (raw) => {
	var timeNow = new Date()
	var updatedAt = new Date(raw)
	var diffHour = Math.abs((timeNow.getTime() - updatedAt.getTime()) / 1000 / 60 / 60 )

	if (diffHour < 1) {
		return `${parseInt(diffHour * 60, 10)}分钟前`
	} else if (diffHour < 24) {
		return `${parseInt(diffHour, 10)}小时前`
	} else if (diffHour >= 24 && diffHour < 168) {
		return `${parseInt(diffHour / 24, 10)}天前`
	} else {
		return updatedAt.format("yyyy-MM-dd");
	}
}

export default timeLabel