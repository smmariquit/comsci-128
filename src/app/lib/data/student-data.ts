async function findStudentProfileById(
	accountNumber: number,
): Promise<StudentProfile | null> {
	const { data, error } = await supabase
		.from("user")
		.select(
			`
            account_number,
            account_email,
            first_name,
            middle_name,
            last_name,
            sex,
            birthday,
            home_address,
            phone_number,
            contact_email,
            profile_picture,
            user_type,
            student:student_account_number_fkey(
                account_number,
                student_number,
                housing_status,
                emergency_contact_name,
                emergency_contact_number,
                emergency_contact_relationship,
                student_academic:student_academic_account_number_fkey(
                    account_number,
                    degree_program,
                    standing,
                    status
                )
            )
            `,
		)
		.eq("account_number", accountNumber)
		.eq("is_deleted", false)
		.single();

	if (error) {
		console.error("Error fetching student profile:", error);
		return null;
	}

	return data;
}