import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { Branching } from "./branching";
import { Role } from "../enum/role.enum";
import { Gender } from "../enum/gender.enum";
import { Department } from "./department";
import { Assignments } from "./assignments";
import { Tasks } from "./tasks";
import { Support } from "./support";
import { Education } from "./education";
import { BroadCasts } from "./broadCasts";
import { Infomation } from "./infomation";
import { Affiliate } from "./Affiliate";
import { StatusUser } from "../enum/statusUser.enum";
import { Media } from "./media";
import { Tickets } from "./tickets";
import { ResponsesTicket } from "./responsesTicket";
import { Statistics } from "./statistics";
import { ResponsibilityIndex } from "./Responsibility_Index";
import { Salary } from "./salary";
import { writeReport } from "./write_report";
import { KnowledgeTree } from "./knowledge-tree";
import { UserProgressTree } from "./user-progress";
import { StatisticUser } from "./statistic_user";
import { UserOnline } from "./UserOnline";
import { Notifications } from "./Notifications";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true, length: 100})
    user_code: string;

    @Column({nullable: true, length: 100})
    email: string;

    @Column({nullable: true, length: 100})
    password: string;

    @Column({nullable: true, length: 100})
    fullname: string;

    @Column({nullable: true,length:10})
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: false, default:Role.INTERN })
    role: Role;

    @Column({ type: 'enum', enum: Role, nullable: true })
    duty: Role;

    @Column({nullable: true, length: 100})
    manager: string;

    @Column({nullable: true, type: "text"})
    accountBank: string;

    @Column({nullable: true})
    recuiter_code: string;

    @Column({ type: 'enum', enum: Gender, nullable: false})
    gender: Gender;

    @Column({nullable: true})
    date_of_birth: Date;

    @Column({nullable: true, length: 1000})
    attendance_code:string;

    @Column({nullable: true, length: 1000})
    cccd_front: string;

    @Column({nullable: true, length: 1000})
    cccd_back: string;

    @Column({nullable: true, length: 1000})
    CV: string;

    @Column({nullable: true, length: 1000})
    avatar: string;

    @CreateDateColumn()
    create_at: Date;

    @Column({nullable: true})
    update_at: Date;

    @Column({default:false})
    delete_at:boolean
    
    @Column({type:'enum',enum:StatusUser,default:StatusUser.NOT_APPROVE})
    status:StatusUser

    @OneToOne(() => Branching, (branching) => branching.user)
    branching: Branching;
    user: any;

    @ManyToOne(() => Department, (department) => department.users)
    @JoinColumn({ name: "departmentId" })
    department: Department;

    @Column({ nullable: true })
    departmentId: number;

    @OneToMany(() => Assignments, (assignment) => assignment.user)
    assignment: Assignments[];

    @OneToMany(() => Tasks, task => task.manager)
    managerTasks: Tasks[];

    @OneToMany(() => ResponsibilityIndex, res => res.manager)
    response_manager_index: ResponsibilityIndex[];

    @OneToMany(() => Tasks, task => task.checker)
    checkedBy: Tasks[];

    @OneToMany(() => Support, support => support.user)
    supports: Support[];

    @OneToMany(() => Education, education => education.user)
    education: Education[];

    @OneToMany(() => BroadCasts, broadCast => broadCast.user)
    broadCast: BroadCasts[];

    @OneToMany(() => Infomation, infomation => infomation.user)
    infomation: Infomation[];

    @OneToMany(() => Affiliate, affiliate => affiliate.user)
    affiliate: Affiliate[];

    @OneToMany(() => Media, media => media.user)
    media: Media[];

    @OneToMany(() => Tickets, ticket => ticket.user)
    ticket: Tickets[];
    
    @OneToMany(() => ResponsesTicket, response => response.user)
    response: ResponsesTicket[];

    @OneToMany(() => Statistics, response => response.user)
    statistic: Statistics[];

    @OneToMany(() => ResponsibilityIndex, response => response.user)
    response_index: ResponsibilityIndex[];

    @OneToMany(() => Salary, response => response.user)
    salary: Salary[];

    @OneToOne(() => KnowledgeTree, tree => tree.user)
    knowledgeTree: KnowledgeTree;

    @OneToMany(() => UserProgressTree, response => response.user)
    progresses: UserProgressTree[];

    @OneToMany(() => StatisticUser, response => response.user)
    statistics: StatisticUser[];

    @OneToMany(() => writeReport, response => response.user)
    write: writeReport[];

    @OneToMany(() => UserOnline, response => response.user)
    user_online: UserOnline[];

    @OneToMany(() => Notifications, response => response.user)
    notification: Notifications[];
}