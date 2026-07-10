type MultiSelectProps = {
	options: string[];
	selected: string[];
	setSelected: (skills: string[]) => void;
};

export default function MultiSelect({
	options,
	selected,
	setSelected,
}: MultiSelectProps) {
	function toogle(skillsOption: string) {
		if (selected.includes(skillsOption)) {
			setSelected(selected.filter((skill) => skill !== skillsOption));
		} else {
			setSelected([...selected, skillsOption]);
		}
	}

	return (
		<div className="flex flex-col gap-inline">
			{options.map((skillsOption) => (
				<label
					key={skillsOption}
					className="flex items-center gap-inline cursor-pointer text-label"
				>
					<input
						type="checkbox"
						checked={selected.includes(skillsOption)}
						onChange={() => toogle(skillsOption)}
					/>
					{skillsOption}
				</label>
			))}
		</div>
	);
}
