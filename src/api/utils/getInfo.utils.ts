export async function usersWithManagerInfo<T>(data: { data: T[] },model:any): Promise<T[]> {
    const select = {
        id: true,
        user_code: true,
        email: true,
        fullname: true,
        accountBank: true,
        CV: true,
        duty: true,
        phone: true,
        role: true,
        manager: true,
        gender: true,
        date_of_birth: true,
        attendance_code: true,
        cccd_front: true,
        cccd_back: true,
        avatar: true,
        delete_at: false,
        status: true
    }
    const usersWithManagerInfo = await Promise.all(data.data.map(async (user: any) => {
        if (user.saler) {
            const user_info = await model.findOne({
                select: {
                    ...select 
                },
                where: { user_code: user.saler, delete_at: false }
            });
            
            if (user_info) {
                return { ...user, user_info };
            }
        }
        return user;
    }));

    return usersWithManagerInfo;
}
