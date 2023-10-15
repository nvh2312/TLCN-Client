const moment = require("moment");

const newOrder = (data, domain) => {
  const orderId = data._id;
  const orderLink = `${domain}/account/orders/${orderId}`;
  const orderTime = moment(data.createdAt).format("hh:mm DD-MM-YY");
  const orderStatus = data.status === "Cancelled" ? "đã bị huỷ" : data.status === "Processed" ? "đang chờ xử lý" :data.status === "Waiting Goods" ? "đang chờ lấy hàng" :data.status === "Delivery" ? "đang trên đường giao" : "đã giao thành công"; 
  let address = data?.address;
  const totalPrice = data?.totalPrice;
  let orderAddress = ``;
  address = address.split(",");
  address.forEach((value) => {
    orderAddress += `<br><span>${value}</span>`;
  });
  let listProduct = ``;
  data.cart.forEach((product) => {
    const productImage = product.product.images[0];
    const productName = product.product.title.slice(0,12)+" Màu " +product.product.color;
    const productQuantity = product.quantity;
    const productPrice = product.product.promotion;
    listProduct += `
        <table
          cellpadding="0"
          cellspacing="0"
          class="esdev-mso-table"
          role="none"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
            width: 560px;
          "
        >
          <tbody>
            <tr>
              <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-left"
                  align="left"
                  role="none"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: left;
                  "
                >
                  <tbody>
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 125px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                style="padding: 0; margin: 0; font-size: 0px"
                              >
                                <a
                                  style="
                                    -webkit-text-size-adjust: none;
                                    -ms-text-size-adjust: none;
                                    mso-line-height-rule: exactly;
                                    text-decoration: underline;
                                    color: #926b4a;
                                    font-size: 14px;
                                  "
                                  ><img
                                    class="adapt-img p_image"
                                    src="${productImage}"
                                    alt="${productName}"
                                    style="
                                      display: block;
                                      border: 0;
                                      outline: none;
                                      text-decoration: none;
                                      -ms-interpolation-mode: bicubic;
                                    "
                                    width="125"
                                    title="${productName}"
                                /></a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="padding: 0; margin: 0; width: 20px"></td>
              <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-left"
                  align="left"
                  role="none"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: left;
                  "
                >
                  <tbody>
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 125px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                align="left"
                                class="es-m-p0t es-m-p0b es-m-txt-l"
                                style="
                                  padding: 0;
                                  margin: 0;
                                  padding-top: 20px;
                                  padding-bottom: 20px;
                                "
                              >
                                <h3
                                  style="
                                    margin: 0;
                                    line-height: 24px;
                                    mso-line-height-rule: exactly;
                                    font-family: arial, 'helvetica neue', helvetica,
                                      sans-serif;
                                    font-size: 20px;
                                    font-style: normal;
                                    font-weight: bold;
                                    color: #333333;
                                  "
                                >
                                  <strong class="p_name">${productName}</strong>
                                </h3>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="padding: 0; margin: 0; width: 20px"></td>
              <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-left"
                  align="left"
                  role="none"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: left;
                  "
                >
                  <tbody>
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 176px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                align="right"
                                class="es-m-p0t es-m-p0b"
                                style="
                                  padding: 0;
                                  margin: 0;
                                  padding-top: 20px;
                                  padding-bottom: 20px;
                                "
                              >
                                <p
                                  style="
                                    margin: 0;
                                    -webkit-text-size-adjust: none;
                                    -ms-text-size-adjust: none;
                                    mso-line-height-rule: exactly;
                                    font-family: arial, 'helvetica neue', helvetica,
                                      sans-serif;
                                    line-height: 21px;
                                    color: #666666;
                                    font-size: 14px;
                                  "
                                  class="p_description"
                                >
                                  ${productQuantity}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="padding: 0; margin: 0; width: 20px"></td>
              <td class="esdev-mso-td" valign="top" style="padding: 0; margin: 0">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  class="es-right"
                  align="right"
                  role="none"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    float: right;
                  "
                >
                  <tbody>
                    <tr>
                      <td align="left" style="padding: 0; margin: 0; width: 74px">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          role="presentation"
                          style="
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            border-collapse: collapse;
                            border-spacing: 0px;
                          "
                        >
                          <tbody>
                            <tr>
                              <td
                                align="right"
                                class="es-m-p0t es-m-p0b"
                                style="
                                  padding: 0;
                                  margin: 0;
                                  padding-top: 20px;
                                  padding-bottom: 20px;
                                "
                              >
                                <p
                                  class="p_price"
                                  style="
                                    margin: 0;
                                    -webkit-text-size-adjust: none;
                                    -ms-text-size-adjust: none;
                                    mso-line-height-rule: exactly;
                                    font-family: arial, 'helvetica neue', helvetica,
                                      sans-serif;
                                    line-height: 21px;
                                    color: #666666;
                                    font-size: 14px;
                                  "
                                >
                                  ${productPrice}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      `;
  });
  const email = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="vi">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Order is on its way</title><!--[if (mso 16)]>
  <style type="text/css">
  a {text-decoration: none;}
  </style>
  <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
  #outlook a {
  padding:0;
  }
  .es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
  }
  .es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
  }
  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center } h2 { font-size:26px!important; text-align:center } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
  </style>
  </head>
  <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="vi" style="background-color:#FFFFFF"><!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile" color="#ffffff"></v:fill>
  </v:background>
  <![endif]-->
  <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
  <tr>
  <td valign="top" style="padding:0;Margin:0">
  <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#333333">Cảm ơn bạn đã mua hàng</h1></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">Đơn hàng của bạn ${orderStatus}. Vui lòng xem thông tin đơn hàng phía dưới</p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td align="left" style="padding:20px;Margin:0">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#666666;border-width:0px;display:inline-block;border-radius:30px;width:auto"><a href="${orderLink}" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#666666;border-radius:30px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #666666">Xem đơn hàng</a></span></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:24px;font-style:normal;font-weight:bold;color:#333333">Đơn hàng # ${orderId}</h2><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">${orderTime}</p></td>
  </tr>
  <tr>
  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#a0937d;font-size:14px">Vật phẩm</p></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px"></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td class="esdev-adapt-off" align="left" style="padding: 20px; margin: 0">
  ${listProduct}
  </td>
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px"></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td class="esdev-adapt-off" align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
  <tr>
  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
  <table cellpadding="0" cellspacing="0" class="es-left" align="left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:466px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="right" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">Tổng tiền<br>Giảm giá<br>Ship<br><b>Tổng</b></p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  <td style="padding:0;Margin:0;width:20px"></td>
  <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
  <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:74px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="right" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">${totalPrice} đ<br>0 đ<br>free<br><strong>${totalPrice}</strong></p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:20px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#a0937d;font-size:14px">Địa chỉ giao hàng</p></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px"></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">${orderAddress}</td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:30px">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0;border-bottom:1px solid #999999;background:none;height:1px;width:100%;margin:0px"></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:10px"><h2 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:24px;font-style:normal;font-weight:bold;color:#333333;text-align:center"><b>Mọi thắc mắc xin liên hệ</b></h2></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">0855494217</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">mdr3132003@gmail.com</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px"><br></p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" bgcolor="#fef8ed" style="padding:0;Margin:0;background-color:#fef8ed">
  <table bgcolor="#fef8ed" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#fef8ed;width:600px" role="none">
  <tr>
  <td class="es-m-p10r es-m-p10l" align="left" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px">
  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
  <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0">
  <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr class="links-images-left">
  <td align="center" valign="top" width="33.33%" id="esd-menu-id-0" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0"><a  style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#a0937d;font-size:14px"><img src="https://eceywlr.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/58991620296762845.png" alt="FREE DELIVERY" title="FREE DELIVERY" align="absmiddle" width="25" style="display:inline-block !important;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;padding-right:15px;vertical-align:middle">FREE DELIVERY</a></td>
  <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0;border-left:1px solid #a0937d" id="esd-menu-id-1"><a style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#a0937d;font-size:14px"><img src="https://eceywlr.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/55781620296763104.png" alt="HIGH QUALITY" title="HIGH QUALITY" align="absmiddle" width="25" style="display:inline-block !important;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;padding-right:15px;vertical-align:middle">HIGH QUALITY</a></td>
  <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:10px;border:0;border-left:1px solid #a0937d" id="esd-menu-id-2"><a style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:arial, 'helvetica neue', helvetica, sans-serif;color:#a0937d;font-size:14px"><img src="https://eceywlr.stripocdn.email/content/guids/CABINET_455a2507bd277c27cf7436f66c6b427c/images/88291620296763036.png" alt="BEST CHOICE" title="BEST CHOICE" align="absmiddle" width="25" style="display:inline-block !important;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;padding-right:15px;vertical-align:middle">BEST CHOICE</a></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  </div>
  </body>
  </html>`;
  return email;
};

module.exports = newOrder
