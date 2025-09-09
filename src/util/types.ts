export interface Clue {
	id: string;
	name: string;
	description: string;
}

export interface DialogContent {
	itemId: string;
	title: string;
	content: string;
	isVictory?: boolean;
}

export interface Sequin {
	id: string;
	x: number;
	y: number;
}
