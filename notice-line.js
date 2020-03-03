/**
 * シートから値を取得し、開始・終了と時刻が入ったリストを返す
 * @return {[]: {job: {'start' | 'end'}, time: {time: number}}} 開始・終了と時刻が入ったリスト
 */
function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getActiveSheet()

  var list = []

  var date = sheet.getRange('A1').getValue()
  var count = sheet.getRange('B6').getValue()

  for (var i = 2; i <= count + 1; i++) {
    var day = sheet
      .getRange(1, i, 3, 1)
      .getValues()
      .map(function(n) {
        return ('0' + n[0]).slice(-2)
      })

    if (day[1] != 0) {
      var time = date + '-' + day[0] + ' ' + day[1]
      list.push({job: 'start', time: time})
    }
    if (day[2] != 0) {
      var time = date + '-' + day[0] + ' ' + day[2]
      list.push({job: 'end', time: time})
    }
  }
  Logger.log(list)

  return list
}

/**
 * バイトの開始終了を通知する機能
 */
function notice() {
  var date = new Date()
  var time = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd HH')

  getSheet()
    .filter(function(l) {
      return l.time == time
    })
    .forEach(function(l) {
      lineJob(l.job == 'start' ? '横田社畜モード' : 'バイト終了')
    })
}

/**
 * 今日バイトがあるかないかを通知する機能
 */
function today() {
  var date = new Date()
  var time = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd HH')

  getSheet()
    .filter(function(l) {
      return l.time.split(' ')[0] == time.split(' ')[0]
    })
    .filter(function(l) {
      return l.job == 'start'
    })
    .forEach(function() {
      lineJob('今日はバイトがあります！！')
    })
}

/**
 * IFTTTのAPIを呼んでLINEに通知を送る
 * @param {mes: string} 通知内容
 */
function lineJob(mes) {
  UrlFetchApp.fetch(
    'https://maker.ifttt.com/trigger/notice-line/with/key/cWl5ommh4auDYC3Cl8rjf1?value1=' + mes
  )
}
