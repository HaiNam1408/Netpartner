export class UpdateLearningItemDto {
  id?:number;
  name: string;
}

export class UpdateLearningPathDto {
  name?: string;
  description?: string;
  // Thêm các trường khác của learning path nếu cần
  learningItems?: UpdateLearningItemDto[];
  departmentId?: number;
}
