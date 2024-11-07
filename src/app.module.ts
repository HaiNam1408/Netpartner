import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './typeorm/entities/users';
import { UsersModule } from './api/v1/users/users.module';
import { BranchesModule } from './api/v1/branches/branches.module';
import { Branches } from './typeorm/entities/branches';
import { Branching } from './typeorm/entities/branching';
import { BranchingModule } from './api/v1/branching/branching.module';
import { Department } from './typeorm/entities/department';
import { DepartmentModule } from './api/v1/department/department.module';
import { Category } from './typeorm/entities/categories';
import { CategoriesModule } from './api/v1/categories/categories.module';
import { Events } from './typeorm/entities/events';
import { EventsModule } from './api/v1/events/events.module';
import { Tasks } from './typeorm/entities/tasks';
import { Assignments } from './typeorm/entities/assignments';
import { TasksModule } from './api/v1/tasks/tasks.module';
import { SupportModule } from './api/v1/support/support.module';
import { Support } from './typeorm/entities/support';
import { PlayList } from './typeorm/entities/playList';
import { PlayListModule } from './api/v1/play-list/play-list.module';
import { Education } from './typeorm/entities/education';
import { EducationModule } from './api/v1/education/education.module';
import { BroadCasts } from './typeorm/entities/broadCasts';
import { Notifications } from './typeorm/entities/Notifications';
import { Infomation } from './typeorm/entities/infomation';
import { InfomationsModule } from './api/v1/infomations/infomations.module';
import { Affiliate } from './typeorm/entities/Affiliate';
import { AffilifateModule } from './api/v1/affilifate/affilifate.module';
import { Commissions } from './typeorm/entities/commissions';
import { CommissionsModule } from './api/v1/commissions/commissions.module';
import { Customers } from './typeorm/entities/Customers';
import { CustomersModule } from './api/v1/customers/customers.module';
import { RegisteredCustomer } from './typeorm/entities/register_customer';
import { DepositedCustomer } from './typeorm/entities/deposited';
import { OrderHistoryCustomer } from './typeorm/entities/order_history';
import { RegisterCustomerModule } from './api/v1/register_customer/register_customer.module';
import { OrderHistoryModule } from './api/v1/order_history/order_history.module';
import { DepositedModule } from './api/v1/deposited/deposited.module';
import { Media } from './typeorm/entities/media';
import { MediaModule } from './api/v1/media/media.module';
import { Tickets } from './typeorm/entities/tickets';
import { ResponsesTicket } from './typeorm/entities/responsesTicket';
import { NotificationsModule } from './api/v1/notifications/notifications.module';
import { TicketModule } from './api/v1/ticket/ticket.module';
import { Attendance_code } from './typeorm/entities/Attendances';
import { AttendanceCodeModule } from './api/v1/attendance-code/attendance-code.module';
import { Statistics } from './typeorm/entities/statistics';
import { Questions } from './typeorm/entities/question';
import { SalaryBase } from './typeorm/entities/salary_base';
import { QuestionsModule } from './api/v1/questions/questions.module';
import { SalaryBaseModule } from './api/v1/salary_base/salary_base.module';
import { ResponsibilityIndex } from './typeorm/entities/Responsibility_Index';
import { StatisticsModule } from './api/v1/statistics/statistics.module';
import { Video } from './typeorm/entities/videoYtb';
import { QuestionYtb } from './typeorm/entities/questionYtb';
import { UserProgress } from './typeorm/entities/userProgress';
import { AnswerYtb } from './typeorm/entities/answerYtb';
import { VideoYtbModule } from './api/v1/video-ytb/video-ytb.module';
import { Salary } from './typeorm/entities/salary';
import { ScheduleModule } from '@nestjs/schedule';
import { SalaryModule } from './api/v1/salary/salary.module';
import { DataUserModule } from './api/v1/data_user/data_user.module';
import { Settings } from './typeorm/entities/settings';
import { CoreValueModule } from './api/v1/core_value/core_value.module';
import { LearningStepModule } from './api/v1/learning_step/learning_step.module';
import { writeReport } from './typeorm/entities/write_report';
import { WriteReportModule } from './api/v1/write_report/write_report.module';
import { MailerModule } from './mailer/mailer.module';
import { UserProgressTree } from './typeorm/entities/user-progress';
import { LearningPath } from './typeorm/entities/learing-path';
import { KnowledgeTree } from './typeorm/entities/knowledge-tree';
import { LearningItem } from './typeorm/entities/learning-item';
import { StatisticUser } from './typeorm/entities/statistic_user';
import { UserOnline } from './typeorm/entities/UserOnline';
import { UserOnlineModule } from './api/v1/user_online/user_online.module';
import { BroadCastTicket } from './typeorm/entities/boardCastTikect';
import { ConfigModule } from '@nestjs/config';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { DashboardModule } from './api/v1/dashboard/dashboard.module';
import { AchievementLog } from './typeorm/entities/achievement-log.entity';
import { AchievementTree } from './typeorm/entities/achievement-tree.entity';
import { MilestonesTree } from './typeorm/entities/milestones-tree.entity';
import { UserProcessAchievementTree } from './typeorm/entities/user-process-achievement-tree.entity';
import { AchievementTreeModule } from './api/v1/achievement-tree/achievement-tree.module';
import { MilestonesTreeModule } from './api/v1/milestones-tree/milestones-tree.module';
import { AchievementLogModule } from './api/v1/achievement-log/achievement-log.module';
import { UserProcessAchievementTreeModule } from './api/v1/user-process-achievement-tree/user-process-achievement-tree.module';
import { Attendance_info } from './typeorm/entities/attendancesInfo';
import { CustomerClone } from './typeorm/entities/customer_clone.entity';
import { CustomerCloneModule } from './api/v1/customer_clone/customer_clone.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '103.110.32.20',
      port: 3306,
      username: 'admin',
      password: '51KZ2ysCn7DNb1a3',
      database: 'db_netpartner',
      entities: [
        Users,
        Branches,
        Branching,
        Department,
        Category,
        Events,
        Tasks,
        Assignments,
        Support,
        PlayList,
        Education,
        BroadCasts,
        Notifications,
        Infomation,
        Affiliate,
        Commissions,
        Customers,
        RegisteredCustomer,
        DepositedCustomer,
        OrderHistoryCustomer,
        Media,
        Tickets,
        ResponsesTicket,
        Attendance_code,
        Statistics,
        Questions,
        SalaryBase,
        ResponsibilityIndex,
        Video,
        QuestionYtb,
        UserProgress,
        AnswerYtb,
        Salary,
        Settings,
        writeReport,
        UserProgressTree,
        LearningPath,
        KnowledgeTree,
        LearningItem,
        StatisticUser,
        UserOnline,
        BroadCastTicket,
        AchievementTree,
        MilestonesTree,
        AchievementLog,
        UserProcessAchievementTree,
        Attendance_info,
        CustomerClone
      ],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    BranchingModule,
    BranchesModule,
    DepartmentModule,
    CategoriesModule,
    EventsModule,
    TasksModule,
    SupportModule,
    PlayListModule,
    EducationModule,
    InfomationsModule,
    AffilifateModule,
    CommissionsModule,
    CustomersModule,
    RegisterCustomerModule,
    OrderHistoryModule,
    DepositedModule,
    MediaModule,
    NotificationsModule,
    TicketModule,
    AttendanceCodeModule,
    QuestionsModule,
    SalaryBaseModule,
    StatisticsModule,
    VideoYtbModule,
    SalaryModule,
    DataUserModule,
    CoreValueModule,
    LearningStepModule,
    WriteReportModule,
    MailerModule,
    UserOnlineModule,
    GoogleDriveModule,
    DashboardModule,
    AchievementTreeModule,
    MilestonesTreeModule,
    AchievementLogModule,
    UserProcessAchievementTreeModule,
    CustomerCloneModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleDriveService],
})
export class AppModule {}
