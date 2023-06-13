class HttpException extends Error {
  constructor(
    status,
    message = '서버 오류가 발생하였습니다.',
  ) {
    super(message);
    this.name = 'HttpException'
    this.status = status
    this.message = message
  }
}

module.exports = { HttpException };