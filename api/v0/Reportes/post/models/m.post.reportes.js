let userModel = {};
userModel.postMeta = (data, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query("insert into metas set ?", data, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
          conn.destroy();
        }
      });
    }
  });
};

module.exports = userModel;
