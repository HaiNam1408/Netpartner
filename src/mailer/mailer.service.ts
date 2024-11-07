import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerOptions } from './mailer-options.interface';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options: MailerOptions = {
      service: 'gmail',
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    this.transporter = nodemailer.createTransport(options);
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: 'haidx@kdhm-solutions.com',
        to,
        subject,
        text,
        html,
      });
      return info;
    } catch (error) {
      throw error;
    }
  }
  createHtml(contextOption?: any, code?: string): string {
    let context: any = {};
    const registerContext = {
      button: 'Xác nhận',
      title:
        'Chúng tôi nhận được yêu cầu lấy lại mật khẩu của bạn vui lòng xác nhận thông tin.',
      desc: `Đây là mật khẩu mới của bạn:${code}`,
      note: 'Vui lòng không lộ thông tin này ra ngoài. Chỉ một mình bạn biết thôi!',
    };
    context = { ...contextOption, ...registerContext };

    return `
     <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LUMA - Password Reset</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f2f5;
          color: #333;
          line-height: 1.6;
          text-align: center;
        }

        /* Header styles */
        header {
          background-color: #fff;
          padding: 15px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .logo {
          width: 120px;
          height: auto;
        }

        .my-account {
          text-decoration: none;
          color: #4a4a4a;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .my-account:hover {
          color: #ff6b6b;
        }

        /* Main content styles */
        .main {
          max-width: 600px;
          margin:0 auto;
          text-align:center;
          background-color: #f0f2f5;
          padding: 40px;
          border-radius: 8px;
          margin-bottom:20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .main-logo {
          width: 150px;
          height: auto;
          margin: 0 auto;
          
        }

        h1 {
          margin-bottom: 20px;
          color: #2c3e50;
          font-size: 28px;
        }

        p {
          margin-bottom: 15px;
          color: #34495e;
        }

        button {
          display: inline-block;
          background-color: #2DAE89;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-decoration:none;
          font-size: 16px;
          margin-top: 10px;
        }
        button a {
          color:white !important;
        }
        /* unvisited link */
        a {
          text-decoration:none;
          color:white
        }
        a:link {
        color: white;
        }

        /* visited link */
        a:visited {
        color: white;
        }
        button:hover {
          background-color: #2DAE89;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
        }

        .action-button.disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        /* Countdown timer styles */
        .countdown {
          font-size: 28px;
          font-weight: bold;
          margin-top: 25px;
          text-align: center;
          color: #e74c3c;
        }

        /* Footer styles */
        footer {
          background-color: #2c3e50;
          color: #ecf0f1;
          padding: 25px 5%;
          text-align: center;
          font-size: 14px;
        }

        footer p {
          margin-bottom: 10px;
          color: #bdc3c7;
        }

        footer a {
          color: #3498db;
          text-decoration: none;
          margin: 0 10px;
          transition: color 0.3s ease;
        }

        footer a:hover {
          color: #2980b9;
          text-decoration: underline;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          main {
            margin: 20px 15px;
            padding: 30px;
          }

          h1 {
            font-size: 24px;
          }

          .countdown {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="main">
        <img src="https://img.upanh.tv/2024/08/19/1723024071819-NET-01-2.png" alt="LUMA Logo" class="main-logo">
        <h1>Xin chào, ${contextOption}!</h1>
        <p>${context?.title}</p>
        <p>${context?.desc}</p>
        <p>${context?.note}.</p>
      </div>
    </body>
    </html>
    `;
  }

  notificationNew(name: string): string {
    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(currentDate);
    return `
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thư thông báo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .main {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .company-name {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
      color: #0056b3;
    }
    .date {
      text-align: right;
      margin-bottom: 20px;
    }
    .recipient {
      font-weight: bold;
      margin-bottom: 20px;
    }
    .content {
      text-align: justify;
    }
    .signature {
      margin-top: 30px;
      font-weight: bold;
    }
    h2 {
      color: #0056b3;
    }
    ul {
      padding-left: 20px;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .main {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="main">
    <div class="company-name">Công Ty TNHH NET Partner</div>
    <div class="date">Hà Nội ${formattedDate}</div>
    <div class="recipient">Thân gửi : ${name}</div>
    <div class="content">
      <h2>Chào mừng bạn đến với đại gia đình Net Partner!</h2>
      <p>Chúng tôi không thể diễn tả hết niềm vui khi bạn đã lựa chọn Net Partner làm điểm dừng chân tiếp theo trong hành trình sự nghiệp của mình. Sự hiện diện của bạn là niềm vinh hạnh và niềm tự hào của chúng tôi. Tại Net Partner, chúng tôi không chỉ tìm kiếm những nhân viên có kỹ năng vượt trội mà còn trân trọng những người có tâm huyết và khát khao cống hiến hết mình cho sự phát triển chung.</p>
      <p>Mỗi nhân viên mới gia nhập đều mang đến luồng gió mới, những ý tưởng sáng tạo và động lực mạnh mẽ. Chúng tôi tin rằng với tài năng và sự đam mê của bạn, chúng ta sẽ cùng nhau viết tiếp những trang thành công mới, tạo nên những giá trị bền vững cho cả công ty và cộng đồng.</p>
      <p>Tại Net Partner, chúng tôi cam kết tạo dựng một môi trường làm việc thân thiện, hỗ trợ và sáng tạo nhất có thể. Để giúp bạn hòa nhập nhanh chóng và thuận lợi, dưới đây là một số hướng dẫn cơ bản:</p>
      <ul>
        <li><strong>Giới thiệu về văn hóa công ty:</strong> Chúng tôi khuyến khích bạn đọc kỹ các tài liệu hướng dẫn và tham gia các buổi chia sẻ văn hóa để hiểu rõ hơn về giá trị và tầm nhìn của chúng tôi.</li>
        <li><strong>Xây dựng mối quan hệ:</strong> Hãy dành thời gian gặp gỡ và trao đổi với các đồng nghiệp trong các buổi giao lưu của công ty. Mỗi thành viên tại Net Partner đều sẵn lòng hỗ trợ và chia sẻ kinh nghiệm với bạn.</li>
        <li><strong>Học hỏi và phát triển:</strong> Tham gia vào các chương trình đào tạo và phát triển kỹ năng mà chúng tôi thiết kế riêng cho bạn. Đây là cơ hội để bạn không ngừng nâng cao kiến thức và phát triển bản thân.</li>
        <li><strong>Tuân thủ quy định:</strong> Đảm bảo rằng bạn đã nắm rõ và tuân thủ các quy định và chính sách của công ty để cùng nhau xây dựng một môi trường làm việc an toàn và hiệu quả.</li>
      </ul>
      <h2>Mong muốn của Lãnh Đạo:</h2>
      <p>Ban lãnh đạo chúng tôi luôn mong muốn rằng mỗi nhân viên không chỉ là một phần của công ty, mà còn là những người đồng hành cùng chúng tôi trên con đường chinh phục những đỉnh cao mới. Chúng tôi hy vọng bạn sẽ nhanh chóng hội nhập, phát huy tài năng và góp phần tạo nên những giá trị đột phá cho Net Partner. Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn trong mọi tình huống để bạn có thể phát triển một cách tốt nhất.</p>
      <p>Chúng tôi mong muốn cùng bạn tạo ra những thành công rực rỡ và ghi dấu những kỷ niệm đáng nhớ trong thời gian sắp tới. Hãy luôn nhớ rằng, bạn không đơn độc trong hành trình này - chúng tôi luôn ở đây để hỗ trợ bạn mọi lúc mọi nơi.</p>
      <p>Nếu có bất kỳ câu hỏi hay cần sự giúp đỡ, đừng ngần ngại liên hệ với bộ phận Nhân sự hoặc người quản lý trực tiếp của bạn.</p>
      <p>Một lần nữa, chào mừng bạn đến với Net Partner. Chúc bạn một hành trình mới đầy hứng khởi và thành công!</p>
    </div>
    <div class="signature">
      Trân Trọng,<br>
      Chairman & Ceo<br>
      Nguyễn Trọng Ngân (Bí Danh: Ngân Lượng)<br>
      Net Partner
    </div>
  </div>
</body>
</html>
    `;
  }

  affiliateNew(name: string, link: string): string {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đăng ký thành công</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4CAF50;">Xác nhận đăng ký thành công</h2>
            <p>Kính gửi anh/chị ${name},</p>
            <p>Cảm ơn bạn đã đăng ký thông tin. Chúng tôi xin xác nhận rằng thông tin của bạn đã được tạo thành công.</p>
            <p>Để hoàn tất quá trình đăng ký và kích hoạt tài khoản của bạn, vui lòng nhấp vào liên kết dưới đây:</p>
            <p><a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Kích hoạt tài khoản</a></p>
            <p>Hoặc copy và paste liên kết sau vào trình duyệt của bạn:</p>
            <p>${link}</p>
            <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
            <p>Trân trọng</p>
        </div>
    </body>
    </html>
    `;
  }
}
