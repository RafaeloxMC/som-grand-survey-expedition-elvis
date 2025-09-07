export interface Clue {
	id: string;
	name: string;
	description: string;
}

export interface DialogContent {
	title: string;
	content: string;
	isVictory?: boolean;
}

export interface Sequin {
	id: string;
	x: number;
	y: number;
}
